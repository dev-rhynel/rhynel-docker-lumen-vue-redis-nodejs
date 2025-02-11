<?php

namespace App\Services;

use App\Models\Post;

class PostService
{
    public function create(array $data): Post
    {
        return Post::create($data);
    }

    public function update(int $id, array $data): Post
    {
        $post = Post::findOrFail($id);
        $post->update($data);
        return $post->fresh();
    }

    public function delete(int $id): bool
    {
        return Post::findOrFail($id)->delete();
    }
}
