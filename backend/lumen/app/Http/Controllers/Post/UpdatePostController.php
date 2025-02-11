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
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class UpdatePostController extends Controller
{
    public function __invoke(int $postId, UpdatePostRequest $request, RepoService $repoService): JsonResponse
    {
        $user = auth()->user();

        $post = $repoService->post()->find($postId);

        if (!$post) {
            return ApiResponse::error('Post not found', 404);
        }

        $payload = json_decode($request->getContent(), true) ?? [];

        $updatedPost = $repoService->post()->update([
            'id' => $post->id,
            'user_id' => $user->id,
        ], [
            'title' => $payload['title'],
            'content' => $payload['content'],
            'user_id' => $user->id
        ]);

        return ApiResponse::success(
            new PostResource($updatedPost),
            'Post updated successfully'
        );
    }
}   