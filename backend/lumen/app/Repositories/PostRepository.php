<?php

namespace App\Repositories;

use App\Interfaces\PostRepositoryInterface;
use App\Models\Post;

class PostRepository implements PostRepositoryInterface
{
    private function model(): \Illuminate\Database\Eloquent\Builder
    {
        return Post::where('user_id', Auth::id());
    }    

    public function index(array $data, array $identifier)
    {
        $posts = $this->model()->where($identifier);

        if (isset($data['sort_by']) && isset($data['sort_direction'])) {
            $posts = $posts->orderBy($data['sort_by'], $data['sort_direction']);
        }
        if (isset($data['filters'])) {
            $filters = collect($data['filters'])->map(function ($value, $key) {
                return [
                    'column' => $key,
                    'value' => $value,
                ];
            });

            foreach ($filters as $filter) {
                $posts->where(
                    $filter['column'],
                    $filter['value']
                );
            }

        }

        if (isset($data['search'])) {
            $posts = $posts->orWhere('title', 'ilike', "%{$data['search']}%");
        }

        return $posts->paginate($data['per_page'] ?? 10);
    }

    public function create(array $data)
    {
        $post = $this->getModel()->create($data);
        return $post->refresh();
    }


    public function find(int $id)
    {
        return $this->getModel()->findOrFail($id);
    }

    public function update(array $identifier, array $updateData): Post
    {
        $post = $this->getModel()->where($identifier)->firstOrFail();
        $post->update($updateData);
        return $post->refresh();
    }

    public function delete(array $identifier, int $taskId): void
    {
        $post = $this->findByIdentifier($identifier);

        $post->getModel()->delete($taskId);
    }
}