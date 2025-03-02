<?php

namespace App\Notifications;

use App\Models\Post;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PostWithSimilarTagNotification extends Notification implements ShouldQueue
{
  use Queueable;

  protected $post;
  protected $tag;
  public function __construct(Post $post, $tag)
  {
    $this->post = $post;
    $this->tag = $tag;
  }

  /**
   * Get the notification's delivery channels.
   *
   * @return array<int, string>
   */
  public function via()
  {
    return ['database', 'broadcast'];
  }



  /**
   * Get the array representation of the notification.
   *
   * @return array<string, mixed>
   */
  public function toArray(): array
  {
    return [
      'message' => "A new question with tag  <strong>{$this->tag}</strong> has been posted recently",
      'post_id' => $this->post->id,
    ];
  }
}
