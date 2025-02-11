# Multi-stage build for both Lumen and Node.js backends

# Stage 1: Build Node.js application
FROM node:18-alpine AS node-builder
WORKDIR /app/backend-node
COPY backend/node/package*.json ./
RUN npm install
COPY backend/node .
RUN npm run build

# Stage 2: Build Lumen application
FROM php:8.2-fpm AS lumen-builder
WORKDIR /app/backend-lumen

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Install composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy Lumen application
COPY backend/lumen/composer.* ./

# Install dependencies
RUN composer install --no-scripts --no-autoloader

# Copy the rest of the application
COPY backend/lumen .

# Generate autoload files and set permissions
RUN composer dump-autoload --optimize \
    && chmod -R 755 storage

# Stage 3: Final image
FROM php:8.2-fpm AS final

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    supervisor \
    zip \
    unzip

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Set up supervisor
RUN mkdir -p /var/log/supervisor
COPY docker/supervisor/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Copy Node.js build
COPY --from=node-builder /app/backend-node/dist /app/backend-node/dist
COPY --from=node-builder /app/backend-node/node_modules /app/backend-node/node_modules
COPY --from=node-builder /app/backend-node/package.json /app/backend-node/package.json

# Copy Lumen build
COPY --from=lumen-builder /app/backend-lumen /app/backend-lumen

WORKDIR /app/backend-lumen

# Start supervisor
CMD ["/usr/bin/supervisord", "-n", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
