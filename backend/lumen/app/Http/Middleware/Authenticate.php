<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Auth\Factory as Auth;
use Illuminate\Http\Request;

class Authenticate
{
    /**
     * The authentication guard factory instance.
     *
     * @var \Illuminate\Contracts\Auth\Factory
     */
    protected $auth;

    /**
     * Create a new middleware instance.
     *
     * @param  \Illuminate\Contracts\Auth\Factory  $auth
     * @return void
     */
    public function __construct(Auth $auth)
    {
        $this->auth = $auth;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string|null  $guard
     * @return mixed
     */
    public function handle(Request $request, Closure $next, $guard = null)
    {
        try {
            $token = $request->bearerToken();
            \Log::info('Auth attempt:', [
                'token' => $token,
                'headers' => $request->headers->all(),
                'guard' => $guard
            ]);

            if (!$token) {
                \Log::warning('No token provided');
                return response()->json(['message' => 'Unauthorized - No token provided'], 401);
            }

            // Try to parse and validate the token
            try {
                $guard = $this->auth->guard($guard);
                $guard->setToken($token);

                if (!$guard->authenticate()) {
                    \Log::warning('Token authentication failed');
                    return response()->json(['message' => 'Unauthorized - Invalid token'], 401);
                }

                $user = $guard->user();
                if (!$user) {
                    \Log::warning('No user found for token');
                    return response()->json(['message' => 'Unauthorized - User not found'], 401);
                }

                \Log::info('Successfully authenticated user:', [
                    'user_id' => $user->id,
                    'token_claims' => $guard->getPayload()->toArray()
                ]);

                return $next($request);

            } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
                \Log::warning('Token has expired');
                return response()->json(['message' => 'Token has expired'], 401);
            } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
                \Log::warning('Token is invalid');
                return response()->json(['message' => 'Token is invalid'], 401);
            } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
                \Log::error('JWT error: ' . $e->getMessage());
                return response()->json(['message' => 'Could not process token'], 401);
            }

        } catch (\Exception $e) {
            \Log::error('Auth error: ' . $e->getMessage(), [
                'exception' => get_class($e),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['message' => 'Authentication failed: ' . $e->getMessage()], 401);
        }
    }
}
