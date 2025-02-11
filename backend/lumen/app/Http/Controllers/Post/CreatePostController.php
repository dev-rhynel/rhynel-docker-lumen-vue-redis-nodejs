<?php

declare(strict_types=1);

namespace App\Http\Controllers\Post;

use App\Http\Controllers\Controller;
use App\Http\Requests\Post\CreatePostRequest;
use App\Repositories\RepoService;
use Illuminate\Http\JsonResponse;
use App\Core\ApiResponse;

class CreatePostController extends Controller
{
    public function __invoke(CreatePostRequest $request, RepoService $repoService): JsonResponse
    {
        $user = $request->user();
        
        if (!$user) {
            return ApiResponse::error('Unauthorized', 401);
        }
        
        $post = $repoService->post()->create([
            'title' => $request->input('title'),
            'content' => $request->input('content'),
            'user_id' => $user->id,
        ]);

        return ApiResponse::success($post, 'Post created successfully', 201);
    }
}