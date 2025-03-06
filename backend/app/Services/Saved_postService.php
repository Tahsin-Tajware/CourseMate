<?php

namespace App\Services;

use App\Models\Post;
use App\Models\Saved_post;
use App\Models\User;

class Saved_postService
{
  public function savePost(int $post_id)
  {
    $post = Post::find($post_id);
    $user = auth('api')->user();
    if (!$user) {
      return ['error' => 'User not authenticated'];
    }
    $current_userId = auth('api')->user()->id;

    if ($current_userId == $post->user_id) {
      return ['error' => 'Invalid request'];
    }
    if ($user->savedPost()->where('post_id', $post_id)->exists()) {
      return ['message' => 'Post already saved'];
    }
    $user->savedPost()->attach($post_id);
    return ['message' => 'Post saved successfully'];
  }
  public function deleteSavedPost(int $post_id)
  {
    $user = auth('api')->user();
    if (!$user) {
      return ['error' => 'User not authenticated'];
    }
    $user->savedPost()->detach($post_id);
    return ['message' => 'Post removed from saved'];
  }

  public function getSavedPost()
  {
    $user = auth('api')->user();
    if (!$user) {
      return ['error' => 'User not authenticated'];
    }
    $saved_posts =  $user->savedPost()->with(['user', 'tags'])->get();
    return $saved_posts;
    //
  }
}
