<?php

namespace App\Services;

use App\Models\Comment;
use GuzzleHttp\Client;

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
    return Comment::where('post_id', $post_id)
      ->whereNull('parent_id')
      ->with(['replies.user',
            'replies.votes', // load votes on replies
            'user',
            'votes'          // load votes on top-level comments
        ])
        ->orderBy('created_at', 'desc')
        ->get();

    // Process top-level comments
    foreach ($comments as $comment) {
        $this->appendVoteDataToComment($comment);
    }

    return $comments;
}

/**
 * Recursively append votes_count and user_vote to a comment and its replies.
 */
private function appendVoteDataToComment(Comment $comment)
{
    // 1) Net votes
    $comment->votes_count = $comment->votes->sum('value');

    // 2) Current user’s vote
    $comment->user_vote = 0;
    if (auth('api')->check()) {
        $existingVote = $comment->votes
            ->where('user_id', auth('api')->id())
            ->first();
        $comment->user_vote = $existingVote ? $existingVote->value : 0;
    }

    // Process nested replies
    if ($comment->replies && $comment->replies->count() > 0) {
        foreach ($comment->replies as $reply) {
            $this->appendVoteDataToComment($reply);
        }
    }
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

  public function deleteComment($comment_id)
  {
    $comment = Comment::findOrFail($comment_id);
    $comment->delete();
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
}
