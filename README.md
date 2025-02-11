# Full-Stack Application with Lumen, Vue.js, Redis, and Node.js

A modern full-stack application using Laravel Lumen for the backend API, Vue.js for the frontend, Redis for caching, and Node.js, all containerized with Docker.

## Tech Stack

- **Backend**: Laravel Lumen (PHP Framework)
- **Frontend**: Vue.js
- **Caching**: Redis
- **Runtime**: Node.js
- **Containerization**: Docker
- **Database**: MySQL

## Prerequisites

- Docker and Docker Compose
- Make (optional, for using Makefile commands)
- Git

## Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd rhynel-docker-lumen-vue-redis-nodejs
   ```

2. Build and start the containers:
   ```bash
   docker-compose up -d --build
   ```

3. Install backend dependencies:
   ```bash
   docker-compose exec backend composer install
   ```

4. Install frontend dependencies:
   ```bash
   docker-compose exec frontend npm install
   ```

5. Set up environment variables:
   - Copy `.env.example` to `.env` in both backend and frontend directories
   - Configure the necessary environment variables

## Running the Application

The application will be available at:
- Frontend: http://localhost:8080
- Backend API: http://localhost:8000
- Redis: localhost:6379 (internal access)

### Using Makefile Commands

This project includes a Makefile for common operations:
```bash
make up        # Start all containers
make down      # Stop all containers
make build     # Rebuild containers
make logs      # View container logs
```

## Project Structure

```
.
├── backend/           # Lumen API
├── frontend/         # Vue.js application
├── docker/           # Docker configuration files
├── Dockerfile        # Backend Dockerfile
├── Dockerfile.frontend # Frontend Dockerfile
└── docker-compose.yml # Docker composition
```

## Development

- Backend API development:
  - The Lumen API is located in the `backend` directory
  - API endpoints are defined in `backend/routes/web.php`
  - Controllers are in `backend/app/Http/Controllers`

- Frontend development:
  - Vue.js application is in the `frontend` directory
  - Components are in `frontend/src/components`
  - Views are in `frontend/src/views`

## API Documentation

API documentation can be found at `/api/documentation` when running the backend server.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Authors

- Rhynel Algopera - Initial work

## Acknowledgments

- Laravel Lumen Team
- Vue.js Team
- Docker Team