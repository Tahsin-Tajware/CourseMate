<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\SerializesModels;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use App\Models\Comment;
use Carbon\Traits\Serialization;


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
    if ($this->type === 'new') {
      return "New comment on your post.";
    } elseif ($this->type === 'reply') {
      return "Someone replied to your comment.";
    } elseif ($this->type === 'update') {
      return "A comment you interacted with has been updated.";
    }
  }
}
