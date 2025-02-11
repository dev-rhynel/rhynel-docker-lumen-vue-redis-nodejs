<?php

namespace App\Repositories;

use App\Interfaces\UserRepositoryInterface;
use App\Models\User;

class UserRepository implements UserRepositoryInterface
{
    private function model(bool $useSelect = false): \Illuminate\Database\Eloquent\Builder
    {
        if ($useSelect) {
            return User::select([
                'first_name',
                'last_name',
                'username',
                'email',
                'provider',
                'avatar',
                'is_activated',
                'bio',
                'id',
            ]);
        }

        return new User();
    }

    public function create(array $data)
    {
        return $this->model()->create($data);
    }

    public function find($id)
    {
        return $this->model()->find($id);
    }
}