<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use GuzzleHttp\Client;

class NodeIntegrationTest extends TestCase
{
    protected $httpClient;

    protected function setUp(): void
    {
        parent::setUp();
        $this->httpClient = new Client([
            'base_uri' => 'http://backend:3001',
            'timeout' => 5.0,
        ]);
    }

    /**
     * Test that Node.js cached data endpoint is accessible.
     *
     * @return void
     */
    public function test_node_cached_data_endpoint()
    {
        $response = $this->httpClient->get('/api/cache-test/cached-data');
        $data = json_decode($response->getBody(), true);

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertArrayHasKey('message', $data);
        $this->assertArrayHasKey('timestamp', $data);
    }

    /**
     * Test that Node.js can communicate with Redis.
     *
     * @return void
     */
    public function test_node_redis_communication()
    {
        // First request should cache the data
        $firstResponse = $this->httpClient->get('/api/cache-test/cached-data');
        $firstData = json_decode($firstResponse->getBody(), true);

        // Second request should return cached data
        $secondResponse = $this->httpClient->get('/api/cache-test/cached-data');
        $secondData = json_decode($secondResponse->getBody(), true);

        $this->assertEquals($firstData, $secondData);
    }

    /**
     * Test authentication token works with Node.js API.
     *
     * @return void
     */
    public function test_auth_token_works_with_node()
    {
        // Create a user and get token from Lumen
        $user = User::create([
            'name' => 'Node Test User',
            'email' => 'node.test@example.com',
            'password' => Hash::make('password123')
        ]);

        $token = auth()->login($user);

        // Test Node.js protected endpoint with token
        $response = $this->httpClient->get('/api/protected-route', [
            'headers' => [
                'Authorization' => 'Bearer ' . $token
            ]
        ]);

        $this->assertEquals(200, $response->getStatusCode());
    }

    /**
     * Test error handling between Lumen and Node.js.
     *
     * @return void
     */
    public function test_error_handling()
    {
        $this->expectException(\GuzzleHttp\Exception\ClientException::class);

        // Try to access protected route without token
        $this->httpClient->get('/api/protected-route');
    }

    protected function tearDown(): void
    {
        parent::tearDown();
    }
}
