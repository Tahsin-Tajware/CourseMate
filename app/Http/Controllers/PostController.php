<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Tag;
use Illuminate\Http\Request;
use App\Http\Requests\CreatePostRequest;

class PostController extends Controller
{
  public function createPost(CreatePostRequest $request)
  {

    $validatedData = $request->validated();
    $post = Post::create(
      [
        'title' => $validatedData['title'],
        'content' => $validatedData['content'],
        'is_anonymous' => $validatedData['is_anonymous'],
        'user_id' => auth('api')->user()->id,
        'tags' => $validatedData['tags'],
      ]
    );

    if (!empty($validatedData['tags'])) {
      $tagIds = [];
      foreach ($validatedData['tags'] as $tagData) {
        $tag = Tag::firstOrCreate(
          [
            'course_code' => $tagData['course_code'],

            'course_name' => $tagData['course_name'],
            'varsity' => $tagData['varsity']
          ]
        );
        $tagIds[] = $tag->id;
      }
      $post->tags()->attach($tagIds);
    }

    return response()->json(['message' => 'Post created successfully', 'post' => $post->load('tags')], 201);
  }
}
