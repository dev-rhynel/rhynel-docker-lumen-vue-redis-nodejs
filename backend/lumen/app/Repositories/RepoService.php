<?php

namespace App\Repositories;

use App\Interfaces\UserRepositoryInterface;
use App\Interfaces\PostRepositoryInterface;
use App\Repositories\UserRepository;
use App\Repositories\PostRepository;

class RepoService
{
    public static function user(): UserRepositoryInterface
    {
        return new UserRepository();
    }

    public static function post(): PostRepositoryInterface
    {
        return new PostRepository();
    }
}