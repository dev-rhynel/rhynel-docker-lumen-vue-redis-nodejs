<?php

namespace App\Http\Controllers\Post;

use App\Http\{
    Controllers\Controller,
};
use App\Repositories\RepoService;
use App\Core\ApiResponse;
use Illuminate\Http\Request;

class DeletePostController extends Controller
{
    public function __invoke(int $postId, Request $request, RepoService $repoService)
    {
        $repoService->post()->delete(['user_id' => $request->user()->id, 'id' => $postId], $postId);

        return ApiResponse::success(['message' => 'Post deleted successfully', 'code' => 201]);
    }
}