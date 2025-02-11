<?php

namespace Tests\Unit\Services;

use App\Models\Post;
use App\Services\PostService;
use Tests\TestCase;
use Laravel\Lumen\Testing\DatabaseMigrations;

class PostServiceTest extends TestCase
{
    use DatabaseMigrations;

    private PostService $postService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->postService = app(PostService::class);
    }

    public function test_can_create_post()
    {
        $user = \App\Models\User::factory()->create();
        
        $data = [
            'title' => 'Test Post',
            'content' => 'Test Content',
            'status' => 'draft',
            'user_id' => $user->id
        ];

        $post = $this->postService->create($data);

        $this->assertInstanceOf(Post::class, $post);
        $this->assertEquals($data['title'], $post->title);
        $this->assertEquals($data['content'], $post->content);
        $this->assertEquals($data['status'], $post->status);
    }

    public function test_can_update_post()
    {
        $post = Post::factory()->create();
        
        $updateData = [
            'title' => 'Updated Title',
            'content' => 'Updated Content'
        ];

        $updatedPost = $this->postService->update($post->id, $updateData);

        $this->assertEquals($updateData['title'], $updatedPost->title);
        $this->assertEquals($updateData['content'], $updatedPost->content);
    }

    public function test_can_delete_post()
    {
        $post = Post::factory()->create();

        $this->postService->delete($post->id);

        $this->seeInDatabase('posts', [
            'id' => $post->id
        ]);
        $this->assertNotNull(Post::withTrashed()->find($post->id)->deleted_at);
        $this->assertNull(Post::find($post->id));
    }
}
