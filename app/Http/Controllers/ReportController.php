<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comment;
use App\Models\Report;

class ReportController extends Controller
{
  public function reportComment(Request $request, $comment_id)
  {
    //user_id is the reporter id

    if (Report::where('user_id', auth()->id())->where('comment_id', $comment_id)->exists()) {
      return response()->json(['message' => 'You have already reported this comment.'], 400);
    }
    $request->validate([
      'reason' => 'required|string|max:255',
    ]);

    $comment = Comment::findOrFail($comment_id);

    Report::create([
      'user_id' => auth()->id(),
      'comment_id' => $comment->id,
      'reason' => $request->reason,
      'reported_user_id' => $comment->user_id
    ]);

    return response()->json(['message' => 'Comment reported successfully']);
  }
}
