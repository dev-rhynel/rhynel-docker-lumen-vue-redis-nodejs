<?php

declare(strict_types=1);

namespace App\Http\Controllers\Post;

use App\Http\{
    Controllers\Controller,
    Requests\Post\CreatePostRequest,
    Resources\PostResource
};
use App\Repositories\RepoService;
use App\Core\ApiResponse;
use Illuminate\Http\JsonResponse;

class CreatePostController extends Controller
{
    public function __invoke(CreatePostRequest $request, RepoService $repoService): JsonResponse
    {
        $post = $repoService->post()->create([
                ...$request->all(),
                'user_id' => $request->user()->id,
            ]);

        return ApiResponse::success(new PostResource($post), 'Post created successfully', 201);
    }
}