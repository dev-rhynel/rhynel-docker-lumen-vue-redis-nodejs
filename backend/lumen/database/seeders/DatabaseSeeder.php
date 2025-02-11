<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Post;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Create test users
        $users = [
            [
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'password' => Hash::make('password123')
            ],
            [
                'name' => 'Jane Smith',
                'email' => 'jane@example.com',
                'password' => Hash::make('password123')
            ]
        ];

        foreach ($users as $userData) {
            $user = User::create($userData);
            
            // Create posts for each user
            $posts = [
                [
                    'title' => "First Post by {$user->name}",
                    'content' => "This is the first post content by {$user->name}. Lorem ipsum dolor sit amet.",
                    'user_id' => $user->id
                ],
                [
                    'title' => "Second Post by {$user->name}",
                    'content' => "This is the second post content by {$user->name}. Consectetur adipiscing elit.",
                    'user_id' => $user->id
                ],
                [
                    'title' => "Third Post by {$user->name}",
                    'content' => "This is the third post content by {$user->name}. Sed do eiusmod tempor incididunt.",
                    'user_id' => $user->id
                ]
            ];

            foreach ($posts as $postData) {
                Post::create($postData);
            }
        }
    }
}
