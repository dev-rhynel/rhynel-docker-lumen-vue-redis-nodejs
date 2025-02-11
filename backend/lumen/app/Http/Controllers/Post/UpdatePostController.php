<?php

declare(strict_types=1);

namespace App\Http\Controllers\Post;

use App\Http\{
    Controllers\Controller,
    Requests\Post\UpdatePostRequest,
    Resources\PostResource
};
use App\Repositories\RepoService;
use App\Core\ApiResponse;
use Illuminate\Http\JsonResponse;
use App\Events\CompletedPost;
use App\Core\Enums\PostStatusEnum;

class UpdatePostController extends Controller
{
    public function __invoke(int $PostId, UpdatePostRequest $request, RepoService $repoService): JsonResponse
    {
        $recentPost = $repoService->Post()->findByIdentifier([
             'id' => $PostId,
             'user_id' => $request->user()->id,
         ]);

        $updatedPost = $repoService->Post()->update([
            'id' => $PostId,
            'user_id' => $request->user()->id,
        ], $request->validated());

        if ($recentPost->status !== PostStatusEnum::Completed
        && $updatedPost->status === PostStatusEnum::Completed) {
            CompletedPost::dispatch($request->user());
        }

        return ApiResponse::success(
            new PostResource($updatedPost),
            'Post updated successfully'
        );
        
    }
}