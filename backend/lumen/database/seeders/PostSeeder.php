<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Create a test user if none exists
        $user = User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => app('hash')->make('password123'),
            ]
        );

        // Create sample posts
        $posts = [
            [
                'title' => 'First Post',
                'content' => 'This is the content of the first post.',
                'user_id' => $user->id,
            ],
            [
                'title' => 'Second Post',
                'content' => 'This is the content of the second post.',
                'user_id' => $user->id,
            ],
            [
                'title' => 'Third Post',
                'content' => 'This is the content of the third post.',
                'user_id' => $user->id,
            ],
        ];

        foreach ($posts as $post) {
            Post::create($post);
        }
    }
}
