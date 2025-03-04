<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Tag;
use Illuminate\Http\Request;
use App\Http\Requests\CreatePostRequest;
use App\Services\PostService;
use Illuminate\Support\Facades\DB;

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

    $this->postService->createPost($validatedData, $userId);

    return response()->json(['message' => 'Post created successfully'], 201);
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
    $user_id = auth('api')->id();

    $post = DB::select("
        SELECT 
            posts.*,
            users.id AS user_id,
            users.name AS user_name,
            users.email AS user_email,
            (SELECT SUM(value) FROM votes WHERE votes.post_id = posts.id) AS votes_count,
            (SELECT value FROM votes WHERE votes.post_id = posts.id AND votes.user_id = ?) AS user_vote,
            (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id', tags.id,
                        'course_name', tags.course_name,
                        'course_code', tags.course_code,
                        'varsity', tags.varsity
                    )
                ) 
                FROM tags 
                JOIN post_tag ON tags.id = post_tag.tag_id 
                WHERE post_tag.post_id = posts.id
            ) AS tags
        FROM posts
        JOIN users ON posts.user_id = users.id
        WHERE posts.id = ?
    ", [$user_id, $post_id]);

    if (!$post) {
      return response()->json(['message' => 'Post not found'], 404);
    }

    return response()->json([
      'message' => 'Post fetched successfully',
      'post'    => $post[0] // Because DB::select() returns an array
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

    $posts = $this->postService->getPostsByTag($tag_id);

    return response()->json([
      'message' => 'Posts fetched successfully',
      'posts' => $posts
    ], 200);
  }

  public function search(Request $request)
  {
    $query = Post::query()->with(['tags', 'user'])->withCount(['votes', 'comment']);
    if ($request->has('query') && !empty($request->query('query'))) {

      $searchTerm = '%' . $request->query('query') . '%';
      $posts = DB::select("
          SELECT * FROM posts
          WHERE title LIKE ? OR content LIKE ?
      ", [$searchTerm, $searchTerm]);
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
