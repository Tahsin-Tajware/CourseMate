<?php

namespace App\Services;

use App\Models\Comment;

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
    return Comment::whereNull('parent_id')->where('post_id', $post_id)->with('replies')->get();
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
}
