<?php

/** @var \Laravel\Lumen\Routing\Router $router */
use App\Http\Controllers\Auth\AuthController;

use App\Http\Controllers\Post\CreatePostController;
use App\Http\Controllers\Post\GetPaginatedPostController;
use App\Http\Controllers\Post\GetPostDetailsController;
use App\Http\Controllers\Post\UpdatePostController;
use App\Http\Controllers\Post\DeletePostController;

$router->get('/', function () use ($router) {
    return response()->json([
        'message' => 'Welcome to Lumen API',
        'version' => $router->app->version()
    ]);
});

// Auth Routes
$router->group(['prefix' => 'api/v1'], function () use ($router) {
    $router->post('auth/register', AuthController::class . '@register');
    $router->post('auth/login', AuthController::class . '@login');
    
    // Protected Routes
    $router->group(['middleware' => 'auth'], function () use ($router) {
        $router->get('auth/me', AuthController::class . '@me');
        $router->post('auth/logout', AuthController::class . '@logout');
        
        // Posts Routes
        $router->get('posts', GetPaginatedPostController::class);
        $router->post('posts', CreatePostController::class);
        $router->get('posts/{id}', GetPostDetailsController::class);
        $router->put('posts/{id}', UpdatePostController::class);
        $router->delete('posts/{id}', DeletePostController::class);
    });
});
