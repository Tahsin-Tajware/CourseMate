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
    $posts = Post::with(['user', 'tags', 'votes'])->withCount('comment')->get();
    foreach ($posts as $post) {
      // 1) Net votes
      $post->votes_count = $post->votes->sum('value');

      // 2) Current user’s vote
      //    If not logged in, user_vote = 0
      $post->user_vote = 0;
      if (auth('api')->check()) {
          $existingVote = $post->votes
              ->where('user_id', auth('api')->id())
              ->first();
          $post->user_vote = $existingVote ? $existingVote->value : 0;
      }
  }
    return $posts;
  }
  public function updatePost(array $validatedData, $post_id)
  {
    $post = Post::find($post_id);
    $user_id = auth('api')->user()->id;
    if (!$post) {
      return ['error' => 'post not found'];
    }
    if ($user_id != $post->user_id) {
      return ['error' => 'invalid request'];
    }
    $post->title = $validatedData['title'];
    $post->content = $validatedData['content'];

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
      $post->tags()->sync($tagIds);
    }

    $post->save();

    return $post->load('tags');
  }
  public function deletePost($post_id)
  {
    $post = Post::find($post_id);
    $user_id = auth('api')->user()->id;
    if (!$post) {
      return ['error' => 'post not found'];
    }
    if ($user_id != $post->user_id) {
      return ['error' => 'invalid request'];
    }
    $post->delete();
    return ['message' => 'post deleted successfully'];
  }
}
