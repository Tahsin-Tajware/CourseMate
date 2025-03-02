<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Vote;
use App\Models\Post;
use App\Models\Comment;

class VoteController extends Controller
{
   /**
     * Store or update a vote.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            // The votable type is sent from the client (either "post" or "comment")
            'votable_type' => 'required|string|in:post,comment',
            'votable_id'   => 'required|integer',
            'value'        => 'required|in:1,-1',
        ]);

        // Determine the model class from votable_type
        $modelClass = $validated['votable_type'] === 'post' ? Post::class : Comment::class;

        // Optional: Validate that the votable entity exists
        $votable = $modelClass::findOrFail($validated['votable_id']);

        // Update or create vote
        $vote = Vote::updateOrCreate(
            [
                'user_id'    => auth()->id(),
                'votable_id' => $validated['votable_id'],
                'votable_type' => $modelClass,
            ],
            [
                'value' => $validated['value'],
            ]
        );

        // Recalculate net votes (sum of values) for this entity
        $netVotes = $votable->votes()->sum('value');

        // The current user's vote is the value we just set
        $userVote = $vote->value;
        $voteId   = $vote->id;

        return response()->json([
            'message'  => 'Vote recorded successfully',
            'voteId'     => $voteId,
            'netVotes' => $netVotes,
            'userVote' => $userVote,
        ], 201);
    }

    /**
     * Optionally, add a method to remove a vote.
     */
    public function destroy($voteId)
    {
        $vote = Vote::where('id', $voteId)
                    ->where('user_id', auth()->id())
                    ->firstOrFail();
        $votable = $vote->votable;
        $vote->delete();
        $netVotes = $votable->votes()->sum('value');// Recalculate net votes for this entity after deletion

        return response()->json([
            'message'  => 'Vote removed successfully',
            'netVotes' => $netVotes,
            'userVote' => 0,
            'voteId'   => null,
        ], 200);
    } 
}
