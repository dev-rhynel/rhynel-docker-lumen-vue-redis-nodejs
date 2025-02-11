# Microservices Assessment Project

A microservices-based application using Lumen (PHP), Node.js (TypeScript), Redis, MySQL, and Vue.js.

## Architecture

The project consists of the following components:

- **Lumen Backend**: RESTful API with JWT authentication
- **Node.js Backend**: Microservice with Redis caching
- **MySQL Database**: Data persistence layer
- **Vue.js Frontend**: User interface
- **Redis**: Caching layer
- **Nginx**: Reverse proxy

## Prerequisites

- Docker and Docker Compose
- Node.js 18+
- PHP 8.2+
- Composer

## Getting Started

1. Clone the repository
2. Copy environment files:
   ```bash
   cp backend/lumen/.env.example backend/lumen/.env
   cp backend/node/.env.example backend/node/.env
   cp frontend/vue/.env.example frontend/vue/.env
   ```
3. Start the application:
   ```bash
   docker-compose up -d
   ```
4. Access the services:
   - Frontend: http://localhost:3000
   - Lumen API: http://localhost:8080/api
   - Node.js API: http://localhost:3001/api

## API Documentation

### Authentication Endpoints

- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get authenticated user

### Post Endpoints

- GET /api/posts - List all posts
- POST /api/posts - Create a post
- GET /api/posts/{id} - Get a specific post
- PUT /api/posts/{id} - Update a post
- DELETE /api/posts/{id} - Delete a post

## Testing

Run tests for each service:

```bash
# Lumen tests
docker-compose exec backend-lumen php artisan test

# Node.js tests
docker-compose exec backend-node npm test

# Frontend tests
docker-compose exec frontend npm test
```

## CI/CD

The project uses GitHub Actions for continuous integration and deployment. On each push:

1. Runs linting
2. Executes unit tests
3. Builds Docker images
4. Deploys to staging (on develop branch)
5. Deploys to production (on main branch)

## License

MIT
#   r h y n e l - d o c k e r - l u m e n - v u e - r e d i s - n o d e j s  
 