<?php

namespace App\Http\Controllers\Post;

use App\Http\Controllers\Controller;
use App\Http\Resources\PostResource;
use App\Repositories\RepoService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Core\ApiResponse;

class GetPostDetailsController extends Controller
{
    public function __invoke(Request $request, RepoService $repoService, int $postId): JsonResponse
    {
        $user = $request->user();
        if (!$user) {
            return ApiResponse::error('Unauthorized', 401);
        }

        $post = $repoService->post()->find($postId);

        if (!$post) {
            return ApiResponse::error('Post not found', 404);
        }

        // Check if the authenticated user owns the post
        if ($post->user_id !== $user->id) {
            return ApiResponse::error('Unauthorized access to post', 403);
        }

        return ApiResponse::success(new PostResource($post));
    }
}