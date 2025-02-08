<?php

namespace App\Services;

use App\Models\Post;
use App\Models\Tag;

class PostService
{
  public function createPost(array $validatedData, int $userId)
  {
    $post = Post::create([
      'title' => $validatedData['title'],
      'content' => $validatedData['content'],
      'is_anonymous' => $validatedData['is_anonymous'],
      'user_id' => $userId,
    ]);

    if (!empty($validatedData['tags'])) {
      $tagIds = [];
      foreach ($validatedData['tags'] as $tagData) {
        $tag = Tag::firstOrCreate([
          'course_code' => $tagData['course_code'],
          'course_name' => $tagData['course_name'],
          'varsity' => $tagData['varsity'],
        ]);
        $tagIds[] = $tag->id;
      }
      $post->tags()->attach($tagIds);
    }

    return $post->load('tags');
  }
  public function getNoOfPostsByUser(int $userId)
  {
    return Post::where('user_id', $userId)->count();
  }
  public function getAllPosts()
  {

    // if ($user_id) {
    //   $posts = Post::where('user_id', $user_id)->get();
    //   return response()->json(['message' => 'Posts fetched successfully', 'posts' => $posts], 200);
    // } else {
    //   $posts = Post::all();
    //   return response()->json(['message' => 'Posts fetched successfully', 'posts' => $posts], 200);
    // }
    $posts = Post::with(['user', 'tags'])->get();
    return $posts;
  }
}
