<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
  protected $fillable = ['reported_user_id', 'user_id', 'comment_id', 'reason', 'status'];

  public function user()
  {
    return $this->belongsTo(User::class);
  }

  public function comment()
  {
    return $this->belongsTo(Comment::class);
  }
  public function reportedUser()
  {
    return $this->belongsTo(User::class, 'reported_user_id');
  }
}
