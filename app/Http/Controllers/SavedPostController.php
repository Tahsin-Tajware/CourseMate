<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Services\Saved_postService;

class SavedPostController extends Controller
{
  protected $saved_postService;
  public function __construct(Saved_postService $saved_postService)
  {
    $this->saved_postService = $saved_postService;
  }
  public function save_post($post_id)
  {
    $data = $this->saved_postService->savePost($post_id);
    if (isset($data['error'])) {
      return response()->json(['message' => $data['error']],);
    }
    return response()->json(['message' => $data['message']], 200);
  }
  public function delete_saved_post($post_id)
  {
    $data = $this->saved_postService->deleteSavedPost($post_id);
    if (isset($data['error'])) {
      return response()->json(['message' => $data['error']], 404);
    }
    return response()->json(['message' => $data['message']], 200);
  }
  public function get_saved_posts()
  {
    $savedPosts = $this->saved_postService->getSavedPost();
    if (isset($savedPosts['error'])) {
      return response()->json(['message' => $savedPosts['error']], 404);
    }
    return response()->json($savedPosts, 200);
  }
}
