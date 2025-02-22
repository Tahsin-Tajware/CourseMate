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
}
