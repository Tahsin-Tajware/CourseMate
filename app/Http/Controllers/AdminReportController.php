<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Report;
use App\Models\User;
use App\Models\Comment;
use App\Models\Post;
use App\Models\Tag;
use Carbon\Carbon;

class AdminReportController extends Controller
{
    public function index()
    {
        $reports = Report::with('user', 'comment')->where('status', 'pending')->get();
        return response()->json($reports);
    }

    public function resolve($report_id)
    {
        $report = Report::find($report_id);
        $report->update(['status' => 'resolved']);
        return response()->json(['message' => 'Report marked as resolved.']);
    }

    public function markReportReviewed($report_id)
{
    $report = Report::findOrFail($report_id);

    // Update the report status to 'reviewed'
    $report->update(['status' => 'reviewed']);

    // Count how many times the reported user has been reviewed
    $reviewedCount = Report::where('reported_user_id', $report->reported_user_id)
        ->where('status', 'reviewed')
        ->count();

    // If the user has been reviewed 3 times, block them
    if ($reviewedCount >= 3) {
        $user = User::find($report->reported_user_id);
        $user->update(['is_blocked' => true]);
        \Log::info('User blocked due to multiple reviews:', ['user_id' => $user->id]);
    }

    // Remove the associated comment
    $this->removeComment($report->comment_id);

    return response()->json(['message' => 'Report marked as reviewed.']);
}


    public function removeComment($comment_id)
    {
        $comment = Comment::findOrFail($comment_id);
        $comment->delete();
        return response()->json(['message' => 'Comment removed successfully.']);
    }

    public function removePost($post_id)
    {
        $post = Post::findOrFail($post_id);
        $post->delete();
        return response()->json(['message' => 'Post removed successfully.']);
    }

    public function blockUser($user_id)
    {
        $user = User::findOrFail($user_id);
        $user->update(['is_blocked' => true]);
        $user->update(['blocked_until' => now()->addDays(7)]);
        return response()->json(['message' => 'User blocked successfully.']);
    }

    public function dailyOverview(Request $request)
    {
        $range = $request->query('range', 'daily');
        $today = Carbon::today();

        switch ($range) {
            case 'weekly':
                $startDate = Carbon::now()->subDays(7);
                break;
            case 'monthly':
                $startDate = Carbon::now()->subMonth();
                break;
            case 'daily':
            default:
                $startDate = $today;
                break;
        }

        $overview = [
            'total_users' => User::whereDate('created_at', '>=', $startDate)->count(),
            'new_users' => User::whereDate('created_at', '>=', $startDate)->count(),
            'total_posts' => Post::whereDate('created_at', '>=', $startDate)->count(),
            'new_posts' => Post::whereDate('created_at', '>=', $startDate)->count(),
            'total_comments' => Comment::whereDate('created_at', '>=', $startDate)->count(),
            'new_comments' => Comment::whereDate('created_at', '>=', $startDate)->count(),
            'total_tags' => Tag::whereDate('created_at', '>=', $startDate)->count(),
            'new_tags' => Tag::whereDate('created_at', '>=', $startDate)->count(),
            'reported_comments_today' => Report::whereDate('created_at', $startDate)->count(),
        ];

        return response()->json($overview);
    }
}

