<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Repositories\RepoService;
use App\Core\ApiResponse;

class AuthController extends Controller
{
    protected $repoService;

    public function __construct(RepoService $repoService)
    {
        $this->repoService = $repoService;
    }

    public function register(RegisterRequest $request)
    {
        $data = json_decode($request->getContent(), true) ?? [];
        $request->merge($data);

        $this->validate($request, $request->rules());

        $user = $this->repoService->user()->create([
            'name' => $request->first_name . ' ' . $request->last_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = Auth::login($user);

        return ApiResponse::success([
            'user' => $user,
            'token' => $token,
            'token_type' => 'bearer',
            'expires_in' => Auth::factory()->getTTL() * 60
        ], 'Successfully registered', 201);
    }

    public function login(LoginRequest $request)
    {
        $credentials = $request->only(['email', 'password']);

        if (!$token = Auth::attempt($credentials)) {
            return ApiResponse::error('Invalid credentials', 401);
        }

        return ApiResponse::success([
            'message' => 'Successfully logged in',
            'token' => $token,
            'token_type' => 'bearer',
            'expires_in' => Auth::factory()->getTTL() * 60
        ], 'Login successful', 200);
    }

    public function me()
    {
        return ApiResponse::success(Auth::user(), 'User retrieved successfully', 200);
    }

    public function logout()
    {
        Auth::logout();
        return ApiResponse::success('Successfully logged out', 'Logout successful', 200);
    }
}
