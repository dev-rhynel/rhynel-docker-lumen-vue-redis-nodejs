<?php

namespace App\Http\Controllers\Post;

use App\Http\{
    Controllers\Controller,
    Resources\PostResource
};
use App\Repositories\RepoService;
use App\Core\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GetPostDetailsController extends Controller
{
    public function __invoke(int $postId, RepoService $repoService, Request $request): JsonResponse
    {
        $post = $repoService->post()->findByIdentifier(['id' => $postId, 'user_id' =>  $request->user()->id]);

        return ApiResponse::success(new PostResource($post));
    }
}