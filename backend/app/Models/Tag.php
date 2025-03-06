<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
  protected $fillable = [
    'course_name',
    'course_code',
    'varsity',
  ];
  public function posts()
  {
    return $this->belongsToMany(Post::class);
  }
}
