<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\CommentService;

class CommentController extends Controller
{
  protected $commentService;

  public function __construct(CommentService $commentService)
  {
    $this->commentService = $commentService;
  }

  public function storeComment(Request $request, $post_id)
  {
    $validatedData = $request->validate([
      'content' => 'required|string',
      'parent_id' => 'nullable|exists:comment,id'
    ]);

    $comment = $this->commentService->storeComment($validatedData, $post_id);
    $toxicityScore = $this->commentService->analyzeComment($validatedData['content']);

    if ($toxicityScore > 0.75) {
    }

    return response()->json(['comment' => $comment, 'toxic' => $toxicityScore], 201);
  }

  public function getAllComments($post_id)
  {
    $comments = $this->commentService->getAllComments($post_id);
    return response()->json(['comments' => $comments], 200);
  }


  public function deleteComment($comment_id)
  {
    try {
      $this->commentService->deleteComment($comment_id);
      return response()->json(['message' => 'Comment deleted successfully'], 200);
    } catch (\Exception $e) {
      return response()->json(['error' => 'Comment not found or could not be deleted'], 404);
    }
  }
  public function updateComment($comment_id, Request $request)
  {
    $validatedData = $request->validate([
      'content' => 'required|string'
    ]);
    $comment = $this->commentService->editComment($comment_id, $validatedData);
    return response()->json(['comment' => $comment], 200);
  }
}
