<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;

class SearchController extends Controller
{
  public function search(Request $request)
  {
    $query = $request->input('query');

    // $results = Post::search($query)->get()->map(function ($post) {
    //   return $post->toArray(); // Ensure all attributes are included
    // });
    $results = Post::search($query)->get()
      //dd($results);
      ->map(function ($post) {
        return [
          'id' => $post->id,
          'title' => $post->title,
          'content' => $post->content,
          'user' => [
            'id' => $post->user->id,
            'name' => $post->user->name,
          ],
          'votes_count' => $post->votes()->sum('value'),
          'comments_count' => $post->comment()->count(),
          'tags' => $post->tags,
          'created_at' => $post->created_at->toDateTimeString(),
          'updated_at' => $post->updated_at->toDateTimeString(),
        ];
      });

    return response()->json($results);
  }
}
