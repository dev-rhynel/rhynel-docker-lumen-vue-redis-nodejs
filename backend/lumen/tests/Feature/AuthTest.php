<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthTest extends TestCase
{
    /**
     * Test user registration.
     *
     * @return void
     */
    public function test_user_can_register()
    {
        $userData = [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123'
        ];

        $this->post('/api/v1/auth/register', $userData)
            ->seeStatusCode(201)
            ->seeJsonStructure([
                'user' => [
                    'id',
                    'name',
                    'email',
                    'created_at'
                ],
                'token'
            ]);
    }

    /**
     * Test user login.
     *
     * @return void
     */
    public function test_user_can_login()
    {
        // Create a user
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password123')
        ]);

        $loginData = [
            'email' => 'test@example.com',
            'password' => 'password123'
        ];

        $this->post('/api/v1/auth/login', $loginData)
            ->seeStatusCode(200)
            ->seeJsonStructure([
                'user' => [
                    'id',
                    'name',
                    'email',
                    'created_at'
                ],
                'token'
            ]);
    }

    /**
     * Test authenticated user can get their profile.
     *
     * @return void
     */
    public function test_user_can_get_profile()
    {
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password123')
        ]);

        $token = auth()->login($user);

        $this->get('/api/v1/auth/me', ['Authorization' => 'Bearer ' . $token])
            ->seeStatusCode(200)
            ->seeJsonStructure([
                'id',
                'name',
                'email',
                'created_at',
                'updated_at'
            ]);
    }

    /**
     * Test user logout.
     *
     * @return void
     */
    public function test_user_can_logout()
    {
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password123')
        ]);

        $token = auth()->login($user);

        $this->post('/api/v1/auth/logout', [], ['Authorization' => 'Bearer ' . $token])
            ->seeStatusCode(200)
            ->seeJson([
                'message' => 'Successfully logged out'
            ]);
    }
}
