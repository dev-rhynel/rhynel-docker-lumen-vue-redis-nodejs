<?php

namespace App\Http\Controllers\Post;

use App\Http\Controllers\Controller;
use App\Http\Resources\PostResource;
use App\Repositories\RepoService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class GetPostDetailsController extends Controller
{
    public function __invoke(Request $request, RepoService $repoService, $id): JsonResponse
    {
        $post = $repoService->post()->find($id);

        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        return response()->json(new PostResource($post));
    }
}