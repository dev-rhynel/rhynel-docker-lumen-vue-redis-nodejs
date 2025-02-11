<?php

namespace App\Repositories;

use App\Interfaces\UserRepositoryInterface;
use App\Models\User;

class UserRepository implements UserRepositoryInterface
{
    private function model(): \Illuminate\Database\Eloquent\Builder
    {
        return User::query();
    }

    public function create(array $data)
    {
        return $this->model()->create($data);
    }

    public function find($id)
    {
        return $this->model()->find($id);
    }

    public function findByIdentifier(array $identifier)
    {
        return $this->model()->where($identifier)->first();
    }
}