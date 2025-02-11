<?php

namespace App\Http\Controllers\Post;

use App\Http\{
    Controllers\Controller,
};
use App\Repositories\RepoService;
use App\Core\ApiResponse;

class DeletePostController extends Controller
{
    public function __invoke(int $postId, RepoService $repoService)
    {
        $repoService->post()->delete(['user_id' => auth()->user()->id, 'id' => $postId], $postId);

        return ApiResponse::success(['message' => 'Post deleted successfully', 'code' => 201]);
    }
}