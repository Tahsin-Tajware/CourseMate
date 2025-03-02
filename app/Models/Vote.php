<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vote extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'votable_id', 'votable_type', 'value'];

    // Each vote belongs to a user.
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // The vote is polymorphic: it belongs to either a post or a comment.
    public function votable()
    {
        return $this->morphTo();
    }
}
