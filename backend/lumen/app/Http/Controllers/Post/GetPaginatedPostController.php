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

        // Get the authenticated user
        $user = $request->user();
        
        if (!$user) {
            // Return empty paginated collection if no user
            return PostResource::collection(
                new \Illuminate\Pagination\LengthAwarePaginator([], 0, $selected['itemsPerPage'] ?? 10)
            );
        }

        // Get posts for authenticated user
        $posts = $repoService->post()->index($selected, ['user_id' => $user->id]);

        return PostResource::collection($posts);
    }
}