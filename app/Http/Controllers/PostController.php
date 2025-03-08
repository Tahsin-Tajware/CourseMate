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
}
