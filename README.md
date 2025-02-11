# Full-Stack Application with Lumen, Vue.js, Redis, and Node.js

A modern full-stack application using Laravel Lumen for the backend API, Vue.js 3 with TypeScript for the frontend, Redis for caching, and Node.js, all containerized with Docker. Features a clean, responsive UI with authentication, post management, and real-time updates.

## Tech Stack

### Backend
- **API Framework**: Laravel Lumen (PHP)
- **Database**: MySQL
- **Caching**: Redis
- **Authentication**: JWT

### Frontend
- **Framework**: Vue.js 3
- **Language**: TypeScript
- **State Management**: Composition API + Composables
- **UI Components**: Custom-built with TailwindCSS
- **HTTP Client**: Axios

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Runtime**: Node.js
- **Development Tools**: TypeScript, ESLint, Prettier

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
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Redis: localhost:6379 (internal access)

### Using Makefile Commands

This project includes a Makefile for common operations. Here are all available commands:

```bash
# Container Management
make start          # Start all containers in detached mode
make stop           # Stop and remove all containers
make build          # Rebuild all containers

# Shell Access
make bash           # Access backend container's bash shell
make sql            # Access database container's shell
make frontend-bash  # Access frontend container's shell

# Logs
make frontend-logs  # View frontend container logs
make backend-logs   # View backend container logs

# Testing
make test           # Run PHP tests in the backend container
```

These commands simplify common development tasks and container management operations.

## Features

### Authentication
- JWT-based authentication
- Secure login/logout functionality
- Protected routes and API endpoints

### Post Management
- Create, read, update, and delete posts
- Post status management (Pending, In Progress, Completed)
- Validation and error handling
- Real-time updates

### UI Components
- **BaseButton**: Versatile button component with variants:
  - Primary (Green) - Main actions
  - Error (Red) - Destructive actions
  - Warning (Yellow) - Cautionary actions
  - Info (Blue) - Informational actions
  - Default (Gray) - Secondary actions
  - Loading states with spinner
  - Disabled states

### Dashboard
- User-specific dashboard
- Post listing with pagination
- Quick actions for post management
- Responsive design for all screen sizes

## Project Structure

```
.
├── backend/                 # Lumen API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/  # API endpoints logic
│   │   │   ├── Requests/     # Form requests & validation
│   │   │   └── Resources/    # API resources & transformers
│   │   ├── Core/             # Core functionality
│   │   │   └── Enums/        # Enumerations (e.g., PostStatusEnum)
│   │   └── Repositories/     # Data access layer
│   └── routes/              # API routes
├── frontend/               # Vue.js 3 + TypeScript application
│   ├── src/
│   │   ├── components/     # Reusable Vue components
│   │   │   └── form-fields/ # Form components (BaseButton, etc.)
│   │   ├── composables/    # Shared composition logic
│   │   ├── views/          # Page components
│   │   └── types/          # TypeScript type definitions
├── docker/                 # Docker configuration files
├── Dockerfile             # Backend Dockerfile
├── Dockerfile.frontend    # Frontend Dockerfile
└── docker-compose.yml     # Docker composition
```

## Development

### Backend API Development
- RESTful API endpoints in `backend/routes/web.php`
- Controllers in `backend/app/Http/Controllers`
- Form requests with validation in `backend/app/Http/Requests`
- API resources for response transformation in `backend/app/Http/Resources`
- Repository pattern for data access in `backend/app/Repositories`
- Enums for type safety in `backend/app/Core/Enums`

### Frontend Development
- Vue 3 Composition API with TypeScript
- Reusable components in `frontend/src/components`
- Page components in `frontend/src/views`
- Shared logic in `frontend/src/composables`
- Type definitions in `frontend/src/types`
- TailwindCSS for styling

### Best Practices
- Type-safe development with TypeScript
- Form validation on both frontend and backend
- Proper error handling and user feedback
- Responsive design principles
- Component-based architecture

## API Documentation

API documentation can be found at `/api/documentation` when running the backend server.

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Authors

- Rhynel Algopera - Initial work

## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository.

- Laravel Lumen Team
- Vue.js Team
- Docker Team