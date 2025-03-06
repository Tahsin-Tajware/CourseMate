<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\DatabaseMessage;
use App\Models\Comment;
use App\Models\User;
use Illuminate\Support\Str;

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
