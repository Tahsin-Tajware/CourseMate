<?php

namespace App\Events;

use App\Models\Post;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PostWithSimilarTagNotificationEvent
{
  use  InteractsWithSockets;
  public $post;
  public $tag;
  public $receiverId;

  public function __construct(Post $post, $tag, $receiverId)
  {
    $this->post = $post;
    $this->tag = $tag;
    $this->receiverId = $receiverId;
  }


  public function broadcastOn()
  {
    return new PrivateChannel('App.Models.User.' . $this->receiverId); // Only the intended user can listen
  }
  public function broadcastWith()
  {

    return [
      'message' => "A new question with <strong>{$this->tag}</strong> has been posted recently",
      'post_id' => $this->post->id,
    ];
  }
  public function broadcastAs()
  {
    return 'CommentEvent'; //CommentNotification
  }
}
