<?php

namespace App\Interfaces;

interface PostRepositoryInterface
{
    public function index(array $data, array $identifier);

    public function create(array $data);

    public function find(int $id);

    public function update(array $identifier, array $updateData);

    public function delete(array $identifier, int $postId);
}