<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;

class TagController extends Controller
{
    /**
     * Retrieve all tags.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $tags = Tag::all();
        return response()->json([
            'message' => 'Tags fetched successfully',
            'tags' => $tags
        ], 200);
    }
}
