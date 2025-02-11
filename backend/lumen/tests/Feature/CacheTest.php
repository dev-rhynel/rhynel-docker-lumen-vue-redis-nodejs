<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Support\Facades\Cache;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class CacheTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        Cache::flush();
    }

    /**
     * Test that data can be cached and retrieved.
     *
     * @return void
     */
    public function test_data_can_be_cached()
    {
        $data = ['message' => 'Test data'];
        $key = 'test_key';

        Cache::put($key, $data, 60);
        $cachedData = Cache::get($key);

        $this->assertEquals($data, $cachedData);
    }

    /**
     * Test that cached data expires.
     *
     * @return void
     */
    public function test_cache_expiration()
    {
        $data = ['message' => 'Test data'];
        $key = 'test_key';

        Cache::put($key, $data, 1); // Cache for 1 minute
        sleep(2); // Wait for 2 seconds

        $cachedData = Cache::get($key);
        $this->assertNull($cachedData);
    }

    /**
     * Test that user profile is cached after first request.
     *
     * @return void
     */
    public function test_user_profile_is_cached()
    {
        // Create a user
        $user = User::create([
            'name' => 'Cache Test User',
            'email' => 'cache.test@example.com',
            'password' => Hash::make('password123')
        ]);

        $token = auth()->login($user);
        $cacheKey = 'user_profile_' . $user->id;

        // First request should cache the profile
        $this->get('/api/v1/auth/me', ['Authorization' => 'Bearer ' . $token])
            ->seeStatusCode(200);

        // Verify data is cached
        $this->assertTrue(Cache::has($cacheKey));

        // Verify cached data matches user data
        $cachedProfile = Cache::get($cacheKey);
        $this->assertEquals($user->id, $cachedProfile['id']);
        $this->assertEquals($user->name, $cachedProfile['name']);
        $this->assertEquals($user->email, $cachedProfile['email']);
    }

    /**
     * Test that cache can be cleared.
     *
     * @return void
     */
    public function test_cache_can_be_cleared()
    {
        $data = ['message' => 'Test data'];
        $key = 'test_key';

        Cache::put($key, $data, 60);
        $this->assertTrue(Cache::has($key));

        Cache::forget($key);
        $this->assertFalse(Cache::has($key));
    }

    protected function tearDown(): void
    {
        Cache::flush();
        parent::tearDown();
    }
}
