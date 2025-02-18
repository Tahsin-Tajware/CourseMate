<?php

namespace App\Services;

use App\Models\Comment;
// use Google\Client;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\DB;

class CommentService
{
  public function storeComment(array $validatedData, $post_id)
  {
    $comment = Comment::create([
      'content' => $validatedData['content'],
      'user_id' => auth('api')->user()->id,
      'post_id' => $post_id,
      'parent_id' => $validatedData['parent_id'] ?? null,
    ]);
    return $comment;
  }
  public function getAllComments($post_id)
  {
    return Comment::whereNull('parent_id')->where('post_id', $post_id)->with('replies', 'user')->get();
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
      return ['message' => 'Comment updated successfully'];
    }
    return ['error' => 'Comment not found'];
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
    $res = $result['attributeScores']['TOXICITY']['summaryScore']['value'] ?? 0;

    return $res;
  }
}
