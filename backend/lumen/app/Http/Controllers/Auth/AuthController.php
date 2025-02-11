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
        $payload = json_decode($request->getContent(), true) ?? [];

        $this->validate(new RegisterRequest($payload), $request->rules());

        $user = $this->repoService->user()->create([
            'name' => $payload['first_name'] . ' ' . $payload['last_name'],
            'email' => $payload['email'],
            'password' => Hash::make($payload['password']),
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
        try {
            \Log::info('Login attempt:', ['email' => $request->input('email')]);
            
            $payload = json_decode($request->getContent(), true) ?? [];
            $this->validate(new LoginRequest($payload), $request->rules());

            if (!$token = Auth::attempt([
                'email' => $payload['email'],
                'password' => $payload['password']
            ])) {
                \Log::warning('Login failed - Invalid credentials:', ['email' => $payload['email']]);
                return ApiResponse::error('Invalid credentials', 401);
            }

            $user = Auth::user();
            \Log::info('Login successful:', ['user_id' => $user->id, 'email' => $user->email]);

            return ApiResponse::success([
                'user' => $user,
                'token' => $token,
                'token_type' => 'bearer',
                'expires_in' => Auth::factory()->getTTL() * 60
            ], 'Login successful', 200);
        } catch (\Exception $e) {
            \Log::error('Login error:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return ApiResponse::error('Authentication failed: ' . $e->getMessage(), 401);
        }
    }

    public function me()
    {
        $user = Auth::user();
        if (!$user) {
            return ApiResponse::error('Unauthorized', 401);
        }
        return ApiResponse::success($user, 'User retrieved successfully', 200);
    }

    public function logout()
    {
        Auth::logout();
        return ApiResponse::success('Successfully logged out', 'Logout successful', 200);
    }
}
