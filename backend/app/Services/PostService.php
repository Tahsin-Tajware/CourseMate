<?php

namespace App\Services;

use App\Events\PostWithSimilarTagNotificationEvent;
use App\Models\Post;
use App\Models\Tag;
use App\Notifications\PostWithSimilarTagNotification;
use App\Models\User;

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

      $usersToNotify = User::whereHas('post', function ($query) use ($tagIds) {
        $query->whereHas('tags', function ($tagQuery) use ($tagIds) {
          $tagQuery->whereIn('tags.id', $tagIds);
        });
      })->where('id', '!=', auth('api')->user()->id)->get(); // Exclude the post creator
      error_log($usersToNotify);
      foreach ($usersToNotify as $user) {

        $matchedTags = $user->post()
          ->whereHas('tags', function ($query) use ($tagIds) {
            $query->whereIn('tags.id', $tagIds);
          })
          ->with('tags') //->pluck('tags')->flatten()->unique('id')
          ->first();
        // error_log($matchedTags);
        $res_tag = $matchedTags->tags[0]->course_code . ' ' . $matchedTags->tags[0]->course_name;
        error_log($res_tag);
        $user->notify(new PostWithSimilarTagNotification($post, $res_tag));
        broadcast(new PostWithSimilarTagNotificationEvent($post, $res_tag, $user->id));
      }
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
