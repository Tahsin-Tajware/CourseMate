<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Tag;
use Illuminate\Http\Request;
use App\Http\Requests\CreatePostRequest;
use App\Services\PostService;

class PostController extends Controller
{
  protected $postService;

  public function __construct(PostService $postService)
  {
    $this->postService = $postService;
  }
  public function createPost(CreatePostRequest $request)
  {
    $validatedData = $request->validated();
    $userId = auth('api')->user()->id;

    $post = $this->postService->createPost($validatedData, $userId);

    return response()->json(['message' => 'Post created successfully', 'post' => $post->load('tags')], 201);
  }

  public function getNoOfMyPosts()
  {
    $userId = auth('api')->user()->id;
    $postCount = $this->postService->getNoOfPostsByUser($userId);
    return response()->json(['message' => 'Posts fetched successfully', 'posts' => $postCount], 200);
  }
  public function getAllPost()
  {
    //$userId = auth('api')->user()->id;
    $posts = $this->postService->getAllPosts();
    return response()->json(['message' => 'Posts fetched successfully', 'posts' => $posts], 200);
  }
  public function getMyPost()
  {
    $user = auth('api')->user();
    $post = $user->post()->with('tags')->get();
    return response()->json(['message' => 'Post fetched successfully', 'post' => $post], 200);
  }
  public function getPostById($post_id)
  {
    $post = Post::with('tags', 'user', 'votes')->where('id', $post_id)->first();

    if (!$post) {
      return response()->json(['message' => 'Post not found'], 404);
    }

    // Net votes
    $post->votes_count = $post->votes->sum('value');

    // Current user’s vote
    $post->user_vote = 0;
    if (auth('api')->check()) {
      $existingVote = $post->votes
        ->where('user_id', auth('api')->id())
        ->first();
      $post->user_vote = $existingVote ? $existingVote->value : 0;
    }

    return response()->json([
      'message' => 'Post fetched successfully',
      'post'    => $post
    ], 200);
  }
  public function updatePost($id, CreatePostRequest $request)
  {
    $validatedData = $request->validated();
    $data = $this->postService->updatePost($validatedData, $id);
    if (isset($data['error'])) {
      return response()->json(['message' => $data['error']]);
    }
    return response()->json(['message' => 'Post updated successfully', 'post' => $data], 200);
  }
  public function deletePost($post_id)
  {
    $data = $this->postService->deletePost($post_id);
    if (isset($data['error'])) {
      return response()->json(['message' => $data['error']], 404);
    }
    return response()->json(['message' => 'Post deleted successfully'], 200);
  }
  public function getPostsByTag($tag_id)
  {
    $posts = Tag::find($tag_id)->posts()->with('tags', 'user')->get();
    return response()->json(['message' => 'Posts fetched successfully', 'posts' => $posts], 200);
  }

  public function search(Request $request)
  {
    $query = Post::query()->with(['tags', 'user'])->withCount(['votes', 'comment']);
    if ($request->has('query') && !empty($request->query('query'))) {
      $query->where(function ($q) use ($request) {
        $q->where('title', 'LIKE', '%' . $request->query('query') . '%')
          ->orWhere('content', 'LIKE', '%' . $request->query('query') . '%');
      });
    }
    if ($request->has('tag') && !empty($request->tag)) {
      $query->whereHas('tags', function ($q) use ($request) {
        $q->where('course_code', $request->tag);
      });
    }
    if ($request->has('sort_by')) {
      $allowedSorts = ['votes_count', 'comment_count', 'created_at'];
      $sortBy = in_array($request->sort_by, $allowedSorts) ? $request->sort_by : 'created_at';
      $query->orderBy($sortBy, $request->sort_order ?? 'desc'); // Default: Newest First
    }
    $posts = $query->paginate(10);

    return response()->json($posts);
  }
}
