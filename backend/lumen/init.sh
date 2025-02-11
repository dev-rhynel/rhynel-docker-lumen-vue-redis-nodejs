#!/bin/sh

# Generate app key
php artisan key:generate

# Generate JWT secret
php artisan jwt:secret

# Run migrations and seeds
php artisan migrate:fresh --seed

# Run Node.js migrations and seeds
cd /app/backend-node && npm run seed

# Start PHP server
cd /app/backend-lumen && php -S 0.0.0.0:8000 -t public
