<?php

namespace App\Services;

use App\Models\Comment;
use GuzzleHttp\Client;

class CommentService
{
    public function storeComment(array $validatedData, $post_id)
    {
        $comment = Comment::create([
            'content' => $validatedData['content'],
            'user_id' => auth('api')->user()->id,
            'post_id' => $post_id,
            'parent_id' => $validatedData['parent_id'] ?? null,
        ]);

        return $comment;
    }

    public function getAllComments($post_id)
    {
        return Comment::where('post_id', $post_id)
                       ->whereNull('parent_id')
                       ->with(['replies', 'user'])
                       ->orderBy('created_at', 'desc')
                       ->get();
    }

    public function analyzeComment($text)
    {
        $apiKey = env('GOOGLE_PERSPECTIVE_API_KEY');
        $url = "https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=$apiKey";
        $client = new Client();
        $response = $client->post($url, [
            'json' => [
                "comment" => ["text" => $text],
                "languages" => ["en"],
                "requestedAttributes" => [
                    "TOXICITY" => new \stdClass()
                ]
            ]
        ]);

        $result = json_decode($response->getBody(), true);
        return $result['attributeScores']['TOXICITY']['summaryScore']['value'] ?? 0;
    }
}
