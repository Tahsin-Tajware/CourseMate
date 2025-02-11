<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
  protected $table = 'comment';
  protected $fillable = [
    'content',
    'user_id',
    'post_id',
    'parent_id'
  ];
  public function user()
  {
    return $this->belongsTo(User::class);
  }
  public function post()
  {
    return $this->belongsTo(Post::class);
  }
  public function replies()
  {
    return $this->hasMany(Comment::class, 'parent_id', 'id')->with('replies');
  }
}
