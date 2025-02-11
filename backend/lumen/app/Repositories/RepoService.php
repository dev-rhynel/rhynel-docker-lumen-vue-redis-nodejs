<?php

namespace App\Repositories;

use App\Interfaces\UserRepositoryInterface;
use App\Repositories\UserRepository;

class RepoService
{
    public static function user(): UserRepositoryInterface
    {
        return new UserRepository();
    }
}