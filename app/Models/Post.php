<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
  protected $fillable = [
    "title",
    'content',
    'is_anonymous',
    'user_id',

  ];
  public function user()
  {
    return $this->belongsTo(User::class);
  }
  public function tags()
  {
    return $this->belongsToMany(Tag::class);
  }
  public function comment()
  {
    return $this->hasMany(Comment::class);
  }
  public function votes()
  {
    return $this->morphMany(Vote::class, 'votable');
  }

}
