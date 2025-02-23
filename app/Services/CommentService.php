<?php

namespace App\Services;

use App\Models\Comment;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\DB;
use App\Notifications\CommentNotification;
use App\Events\CommentEvent;
use App\Models\Post;

class CommentService
{
  public function storeComment(array $validatedData, $post_id)
  {
    $user = auth('api')->user();
    $post = Post::find($post_id);
    $comment = Comment::create([
      'content' => $validatedData['content'],
      'user_id' => auth('api')->user()->id,
      'post_id' => $post_id,
      'parent_id' => $validatedData['parent_id'] ?? null,
    ]);

    // Notify post owner if someone comments
    $postOwner = $comment->post->user;
    if ($postOwner->id !== $user->id) {
      $postOwner->notify(new CommentNotification($comment, 'new'));
      broadcast(new CommentEvent($comment, 'new', $post->user_id))->toOthers();
    }

    // Notify parent comment owner if it's a reply
    if ($comment->parent_id) {
      $parentComment = Comment::find($comment->parent_id);
      if ($parentComment && $parentComment->user_id !== $user->id) {
        $parentComment->user->notify(new CommentNotification($comment, 'reply'));
        broadcast(new CommentEvent($comment, 'reply', $parentComment->user_id))->toOthers();
      }
    }

    return $comment;
  }

  public function getAllComments($post_id)
  {
    return Comment::whereNull('parent_id')->where('post_id', $post_id)->with('replies', 'user')
      ->orderBy('created_at', 'desc')
      ->get();
  }
  public function deleteComment($comment_id)
  {
    $comment = Comment::find($comment_id);
    if ($comment) {
      $comment->delete();
      return ['message' => 'Comment deleted successfully'];
    }
    return ['error' => 'Comment not found'];
  }
  public function editComment($comment_id, array $validatedData)
  {
    $comment = Comment::find($comment_id);
    if ($comment) {
      $comment->update($validatedData);
    }
    $post = $comment->post;
    foreach ($comment->replies as $reply) {
      if ($reply->user_id !== $comment->user_id) {
        $reply->user->notify(new CommentNotification($comment, 'update'));
        broadcast(new CommentEvent($comment, 'update', $post->user_id))->toOthers();
      }
    }
    return ['message' => 'Comment updated successfully', 'comment' => $comment];
  }

  public function analyzeComment($text)
  {
    $apiKey = env('GOOGLE_PERSPECTIVE_API_KEY');
    $url = "https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=$apiKey";
    $client = new Client();
    $response = $client->post($url, [
      'json' => [
        "comment" => ["text" => $text],
        "languages" => ["en"],
        "requestedAttributes" => [
          "TOXICITY" => new \stdClass()
        ]
      ]
    ]);

    $result = json_decode($response->getBody(), true);
    return $result['attributeScores']['TOXICITY']['summaryScore']['value'] ?? 0;
  }

  // public function deleteComment($comment_id)
  // {
  //   $comment = Comment::findOrFail($comment_id);
  //   $comment->delete();
  // }
  // public function editComment($comment_id, array $validatedData)
  // {
  //   $comment = Comment::find($comment_id);
  //   if ($comment) {
  //     $comment->update($validatedData);
  //     return ['message' => 'Comment updated successfully'];
  //   }
  //   return ['error' => 'Comment not found'];
  // }
}
