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
        try {
            \Log::info('Creating post', [
                'request' => $request->all(),
                'user' => $request->user()
            ]);

            $user = $request->user();
            
            if (!$user) {
                \Log::warning('No authenticated user found');
                return ApiResponse::error('Unauthorized', 401);
            }
            
            $data = [
                'title' => $request->input('title'),
                'content' => $request->input('content'),
                'user_id' => $user->id,
            ];

            \Log::info('Creating post with data', ['data' => $data]);
            
            $post = $repoService->post()->create($data);
            
            \Log::info('Post created successfully', ['post' => $post]);

            return ApiResponse::success($post, 'Post created successfully', 201);
        } catch (\Exception $e) {
            \Log::error('Failed to create post', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return ApiResponse::error('Failed to create post: ' . $e->getMessage(), 500);
        }
    }
}