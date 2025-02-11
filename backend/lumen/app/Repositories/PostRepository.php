<?php

namespace App\Repositories;

use App\Interfaces\PostRepositoryInterface;
use App\Models\Post;

class PostRepository implements PostRepositoryInterface
{
    private function model(): \Illuminate\Database\Eloquent\Builder
    {
        return Post::query();
    }    

    public function index(array $data, array $identifier)
    {
        $posts = $this->model()->where($identifier);

        if (isset($data['sort_by']) && isset($data['sort_direction'])) {
            $posts = $posts->orderBy($data['sort_by'], $data['sort_direction']);
        }

        if (isset($data['filters']) && is_array($data['filters'])) {
            foreach ($data['filters'] as $key => $value) {
                $posts->where($key, $value);
            }
        }

        if (isset($data['search'])) {
            $posts = $posts->where(function($query) use ($data) {
                $query->where('title', 'like', "%{$data['search']}%")
                      ->orWhere('content', 'like', "%{$data['search']}%");
            });
        }

        return $posts->paginate($data['itemsPerPage'] ?? 10);
    }

    public function create(array $data)
    {
        $post = $this->model()->create($data);
        return $post->refresh();
    }


    public function find(int $id)
    {
        return $this->model()->find($id);
    }

    public function findByIdentifier(array $identifier)
    {
        return $this->model()->where($identifier)->firstOrFail();
    }

    public function update(array $identifier, array $updateData): Post
    {
        $post = $this->findByIdentifier($identifier);
        $post->update($updateData);
        return $post->refresh();
    }

    public function delete(array $identifier, int $postId): void
    {
        $post = $this->findByIdentifier($identifier);
        $post->delete();
    }
}