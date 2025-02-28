<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class Post extends Model
{
  use Searchable;
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
  public function toSearchableArray()
  {
    return [
      'id'      => $this->id,
      'title'   => $this->title,
      'content' => $this->content,
      'user' => [
        'id' => $this->user->id,
        'name' => $this->user->name
      ],
      'tags' => $this->tags->toArray(),
      'votes_count' => $this->votes->sum('value'),
      'comments_count' => $this->comment->count(),
      'created_at' => $this->created_at,
      'updated_at' => $this->updated_at,
    ];
  }
}
