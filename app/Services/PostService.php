<?php

namespace App\Services;

use App\Events\PostWithSimilarTagNotificationEvent;
use App\Models\Post;
use App\Models\Tag;
use Illuminate\Support\Facades\DB;
use App\Notifications\PostWithSimilarTagNotification;
use App\Models\User;

class PostService
{
  public function createPost(array $validatedData, int $userId)
  {
    DB::insert("
        INSERT INTO posts (title, content, is_anonymous, user_id, created_at, updated_at) 
        VALUES (?, ?, ?, ?, NOW(), NOW())
    ", [
      $validatedData['title'],
      $validatedData['content'],
      $validatedData['is_anonymous'],
      $userId
    ]);


    $postId = DB::getPdo()->lastInsertId();


    if (!empty($validatedData['tags'])) {
      $tagIds = [];
      foreach ($validatedData['tags'] as $tagData) {


        $existingTag = DB::select("
                SELECT id FROM tags WHERE course_code = ? AND course_name = ? AND varsity = ?
            ", [
          $tagData['course_code'],
          $tagData['course_name'],
          $tagData['varsity']
        ]);

        if (empty($existingTag)) {

          DB::insert("
                    INSERT INTO tags (course_code, course_name, varsity, created_at, updated_at)
                    VALUES (?, ?, ?, NOW(), NOW())
                ", [
            $tagData['course_code'],
            $tagData['course_name'],
            $tagData['varsity']
          ]);

          $tagId = DB::getPdo()->lastInsertId();
        } else {
          $tagId = $existingTag[0]->id;
        }

        $tagIds[] = $tagId;
      }
      foreach ($tagIds as $tagId) {
        DB::insert("
                INSERT INTO post_tag (post_id, tag_id) VALUES (?, ?)
            ", [$postId, $tagId]);
      }
    }
  }
  public function getNoOfPostsByUser(int $userId)
  {
    return Post::where('user_id', $userId)->count();
  }
  public function getAllPosts()
  {

    $query = "
    SELECT 
    posts.id, 
    posts.title, 
    posts.content, 
    posts.is_anonymous, 
    posts.user_id, 
    posts.created_at, 
    posts.updated_at,
    JSON_OBJECT(
        'id', users.id, 
        'name', users.name
    ) AS user,
    GROUP_CONCAT(
        JSON_OBJECT(
            'id', tags.id,
            'course_name', tags.course_name,
            'course_code', tags.course_code,
            'varsity', tags.varsity        
        ) SEPARATOR '||'
    ) AS tags
FROM posts
JOIN users ON posts.user_id = users.id
LEFT JOIN post_tag ON posts.id = post_tag.post_id
LEFT JOIN tags ON post_tag.tag_id = tags.id
GROUP BY 
    posts.id, 
    posts.title, 
    posts.content, 
    posts.is_anonymous, 
    posts.user_id, 
    posts.created_at, 
    posts.updated_at,
    users.id, 
    users.name;

        
";

    $posts = DB::select($query);

    $posts = array_map(function ($post) {
      $post->user = json_decode($post->user);
      $post->tags = $post->tags ? array_map('json_decode', explode('||', $post->tags)) : [];
      return $post;
    }, $posts);
    return $posts;
  }
  public function updatePost(array $validatedData, $post_id)
  {
    $user_id = auth('api')->user()->id;
    $post = DB::selectOne("SELECT * FROM posts WHERE id = ?", [$post_id]);
    if (!$post) {
      return ['error' => 'post not found'];
    }
    if ($user_id != $post->user_id) {
      return ['error' => 'invalid request'];
    }
    DB::update("
        UPDATE posts 
        SET title = ?, content = ?, updated_at = NOW() 
        WHERE id = ?
    ", [$validatedData['title'], $validatedData['content'], $post_id]);

    if (!empty($validatedData['tags'])) {
      $tagIds = [];
      foreach ($validatedData['tags'] as $tagData) {
        $tag = DB::selectOne("
                SELECT id FROM tags 
                WHERE course_code = ? AND course_name = ? AND varsity = ?
            ", [$tagData['course_code'], $tagData['course_name'], $tagData['varsity']]);
        if (!$tag) {
          DB::insert("
                    INSERT INTO tags (course_code, course_name, varsity, created_at, updated_at) 
                    VALUES (?, ?, ?, NOW(), NOW())
                ", [$tagData['course_code'], $tagData['course_name'], $tagData['varsity']]);

          $tag = DB::selectOne("
                    SELECT id FROM tags 
                    WHERE course_code = ? AND course_name = ? AND varsity = ?
                ", [$tagData['course_code'], $tagData['course_name'], $tagData['varsity']]);
        }

        $tagIds[] = $tag->id;
      }

      DB::delete("DELETE FROM post_tag WHERE post_id = ?", [$post_id]);
      foreach ($tagIds as $tag_id) {
        DB::insert("
                INSERT INTO post_tag (post_id, tag_id) VALUES (?, ?)
            ", [$post_id, $tag_id]);
      }
    }

    $updatedPost = DB::selectOne("SELECT * FROM posts WHERE id = ?", [$post_id]);
    $updatedTags = DB::select("
        SELECT tags.* FROM tags 
        JOIN post_tag ON tags.id = post_tag.tag_id 
        WHERE post_tag.post_id = ?
    ", [$post_id]);

    $updatedPost = (array) $updatedPost;
    $updatedPost['tags'] = $updatedTags;

    return $updatedPost;
  }


  public function deletePost($post_id)
  {
    $post = Post::find($post_id);
    $user_id = auth('api')->user()->id;
    if (!$post) {
      return ['error' => 'post not found'];
    }
    if ($user_id != $post->user_id) {
      return ['error' => 'invalid request'];
    }

    $post->delete();
    return ['message' => 'post deleted successfully'];
  }

  public function getPostsByTag($tag_id)
  {
    $posts = DB::select("
          SELECT 
              posts.id, 
              posts.title, 
              posts.content, 
              posts.is_anonymous, 
              posts.user_id, 
              posts.created_at, 
              posts.updated_at, 
              JSON_OBJECT(
                  'id', users.id, 
                  'name', users.name
              ) AS user,
              GROUP_CONCAT(
                  JSON_OBJECT(
                      'id', tags.id, 
                      'course_name', tags.course_name, 
                      'course_code', tags.course_code, 
                      'varsity', tags.varsity
                  ) SEPARATOR '||'
              ) AS tags
          FROM posts
          JOIN users ON posts.user_id = users.id
          JOIN post_tag ON posts.id = post_tag.post_id
          JOIN tags ON post_tag.tag_id = tags.id
          WHERE post_tag.tag_id = ?
          GROUP BY 
              posts.id, posts.title, posts.content, posts.is_anonymous, 
              posts.user_id, posts.created_at, posts.updated_at, 
              users.id, users.name
      ", [$tag_id]);

    foreach ($posts as $post) {
      if (!empty($post->tags)) {
        $post->tags = array_map('json_decode', explode('||', $post->tags));
      } else {
        $post->tags = [];
      }
    }
    return $posts;
  }
}
