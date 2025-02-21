<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\DatabaseMessage;
use App\Models\Comment;

class CommentNotification extends Notification implements ShouldQueue
{
  use Queueable;

  protected $comment;
  protected $type;

  public function __construct(Comment $comment, $type)
  {
    $this->comment = $comment;
    $this->type = $type; // 'new', 'reply', or 'update'
  }

  public function via($notifiable)
  {
    return ['database', 'broadcast']; // Save in DB and send via WebSocket
  }

  public function toArray($notifiable)
  {
    return [
      'message' => $this->getMessage(),
      'post_id' => $this->comment->post_id,
      'comment_id' => $this->comment->id,
      'user_id' => $this->comment->user_id,
    ];
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
