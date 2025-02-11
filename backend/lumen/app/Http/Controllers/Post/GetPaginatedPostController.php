<?php

declare(strict_types=1);

namespace App\Http\Controllers\Post;

use App\Http\{
    Controllers\Controller,
    Resources\PostResource,
    Requests\PaginationRequest
};
use App\Repositories\RepoService;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class GetPaginatedPostController extends Controller
{
    public function __invoke(PaginationRequest $request, RepoService $repoService): AnonymousResourceCollection
    {
        $selected = $request->only([
            'sort_by',
            'filters',
            'search',
            'sort_direction',
            'itemsPerPage',
        ]);

        // Since auth is disabled, get all posts without user filtering
        $posts = $repoService->post()->index($selected, []);

        return PostResource::collection($posts);
    }
}