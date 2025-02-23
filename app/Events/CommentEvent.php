<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\SerializesModels;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use App\Models\Comment;
use App\Models\User;
use Carbon\Traits\Serialization;
use Illuminate\Support\Str;

class CommentEvent implements ShouldBroadcast
{
  use InteractsWithSockets;

  public $comment;
  public $type;
  public $receiverId;

  public function __construct(Comment $comment, $type, $receiverId)
  {
    $this->comment = $comment;
    $this->type = $type; // 'new', 'reply', or 'update'
    $this->receiverId = $receiverId; // ID of the user who should receive the notification
  }

  public function broadcastOn()
  {
    return new PrivateChannel('App.Models.User.' . $this->receiverId); // Only the intended user can listen
  } //notifications

  public function broadcastWith()
  {
    return [
      'message' => $this->getMessage(),
      'post_id' => $this->comment->post_id,
      'comment_id' => $this->comment->id,
      'user_id' => $this->comment->user_id,
    ];
  }
  public function broadcastAs()
  {
    return 'CommentEvent'; //CommentNotification
  }
  private function getMessage()
  {
    $userName = User::where('id', $this->comment->user_id)->value('name');
    $preview = Str::limit($this->comment->content, 50, '...');
    if ($this->type === 'new') {
      return "$userName commented on your post:\n \"$preview\"";
    } elseif ($this->type === 'reply') {
      return "$userName replied to your comment:\n \"$preview\" .";
    } elseif ($this->type === 'update') {
      return "A comment you interacted with has been updated.";
    }
  }
}
