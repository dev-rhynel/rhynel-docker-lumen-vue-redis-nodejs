<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Post;
use Illuminate\Support\Facades\Hash;

class PostTest extends TestCase
{
    protected $user;
    protected $token;

    /**
     * Set up the test environment.
     *
     * @return void
     */
    protected function setUp(): void
    {
        parent::setUp();

        // Create a user and get token
        $this->user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password123')
        ]);

        $this->token = auth()->login($this->user);
    }

    /**
     * Test user can create a post.
     *
     * @return void
     */
    public function test_user_can_create_post()
    {
        $postData = [
            'title' => 'Test Post',
            'content' => 'This is a test post content.'
        ];

        $this->post('/api/v1/posts', $postData, ['Authorization' => 'Bearer ' . $this->token])
            ->seeStatusCode(201)
            ->seeJsonStructure([
                'id',
                'title',
                'content',
                'user_id',
                'created_at',
                'updated_at'
            ]);
    }

    /**
     * Test user can get all posts.
     *
     * @return void
     */
    public function test_user_can_get_all_posts()
    {
        // Create some posts
        Post::create([
            'title' => 'Test Post 1',
            'content' => 'Content 1',
            'user_id' => $this->user->id
        ]);

        Post::create([
            'title' => 'Test Post 2',
            'content' => 'Content 2',
            'user_id' => $this->user->id
        ]);

        $this->get('/api/v1/posts', ['Authorization' => 'Bearer ' . $this->token])
            ->seeStatusCode(200)
            ->seeJsonStructure([
                '*' => [
                    'id',
                    'title',
                    'content',
                    'user_id',
                    'created_at',
                    'updated_at'
                ]
            ]);
    }

    /**
     * Test user can get a specific post.
     *
     * @return void
     */
    public function test_user_can_get_specific_post()
    {
        $post = Post::create([
            'title' => 'Test Post',
            'content' => 'Test Content',
            'user_id' => $this->user->id
        ]);

        $this->get('/api/v1/posts/' . $post->id, ['Authorization' => 'Bearer ' . $this->token])
            ->seeStatusCode(200)
            ->seeJsonStructure([
                'id',
                'title',
                'content',
                'user_id',
                'created_at',
                'updated_at'
            ]);
    }

    /**
     * Test user can update their post.
     *
     * @return void
     */
    public function test_user_can_update_post()
    {
        $post = Post::create([
            'title' => 'Test Post',
            'content' => 'Test Content',
            'user_id' => $this->user->id
        ]);

        $updateData = [
            'title' => 'Updated Title',
            'content' => 'Updated Content'
        ];

        $this->put('/api/v1/posts/' . $post->id, $updateData, ['Authorization' => 'Bearer ' . $this->token])
            ->seeStatusCode(200)
            ->seeJson([
                'title' => 'Updated Title',
                'content' => 'Updated Content'
            ]);
    }

    /**
     * Test user can delete their post.
     *
     * @return void
     */
    public function test_user_can_delete_post()
    {
        $post = Post::create([
            'title' => 'Test Post',
            'content' => 'Test Content',
            'user_id' => $this->user->id
        ]);

        $this->delete('/api/v1/posts/' . $post->id, [], ['Authorization' => 'Bearer ' . $this->token])
            ->seeStatusCode(200)
            ->seeJson([
                'message' => 'Post deleted successfully'
            ]);

        $this->notSeeInDatabase('posts', ['id' => $post->id]);
    }

    /**
     * Test user cannot update other user's post.
     *
     * @return void
     */
    public function test_user_cannot_update_others_post()
    {
        $otherUser = User::create([
            'name' => 'Other User',
            'email' => 'other@example.com',
            'password' => Hash::make('password123')
        ]);

        $post = Post::create([
            'title' => 'Other User Post',
            'content' => 'Other User Content',
            'user_id' => $otherUser->id
        ]);

        $updateData = [
            'title' => 'Updated Title',
            'content' => 'Updated Content'
        ];

        $this->put('/api/v1/posts/' . $post->id, $updateData, ['Authorization' => 'Bearer ' . $this->token])
            ->seeStatusCode(403);
    }

    /**
     * Test user cannot delete other user's post.
     *
     * @return void
     */
    public function test_user_cannot_delete_others_post()
    {
        $otherUser = User::create([
            'name' => 'Other User',
            'email' => 'other@example.com',
            'password' => Hash::make('password123')
        ]);

        $post = Post::create([
            'title' => 'Other User Post',
            'content' => 'Other User Content',
            'user_id' => $otherUser->id
        ]);

        $this->delete('/api/v1/posts/' . $post->id, [], ['Authorization' => 'Bearer ' . $this->token])
            ->seeStatusCode(403);
    }
}
