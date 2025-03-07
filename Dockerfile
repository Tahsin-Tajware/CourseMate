# Multi-stage build for Laravel + React with Vite
# Stage 1: Build React application with Vite
FROM node:20-alpine as react-builder
WORKDIR /app
# Copy React-specific package files and install dependencies
COPY ./react/package*.json ./
RUN npm install
# Copy React source code
COPY ./react/ ./
# Build React application (creates dist folder)
RUN npm run build

# Stage 2: Laravel application
FROM php:8.2.12-apache
# Enable Apache modules
RUN a2enmod rewrite
# Install system dependencies
RUN apt-get update && apt-get install -y \
  git \
  curl \
  libpng-dev \
  libonig-dev \
  libxml2-dev \
  libpq-dev \
  zip \
  unzip
# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*
# Install PHP extensions
RUN docker-php-ext-install pdo pdo_pgsql pgsql  mbstring exif pcntl bcmath gd
# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
# Set working directory
WORKDIR /var/www/html
# Copy composer files and install dependencies
COPY composer.json composer.lock ./
RUN composer install --no-scripts --no-autoloader --no-dev
# Copy Laravel files
COPY . /var/www/html/
# Copy built React app from the first stage
COPY --from=react-builder /app/dist /var/www/html/public/react
# Generate optimized autoloader and run scripts
RUN composer dump-autoload --optimize --no-dev
RUN composer run-script post-autoload-dump
# Create .env file if it doesn't exist
# RUN if [ ! -f .env ]; then cp .env.example .env; fi
# Generate key and optimize
#RUN php artisan key:generate --force
#RUN php artisan config:cache
#RUN php artisan route:cache
#RUN php artisan view:cache
# Configure Apache document root
RUN sed -i 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/000-default.conf
# Set permissions
RUN chown -R www-data:www-data /var/www/html \
  && chmod -R 755 /var/www/html \
  && chmod -R 777 storage bootstrap/cache
# Expose port 80
EXPOSE 80
# Updated start script with migrate:fresh
RUN echo '#!/bin/bash\n\
  cd /var/www/html\n\
  echo "Running fresh database migrations..."\n\
  php artisan migrate --force\n\
  echo "migration complete"\n\
  echo "Starting Apache server..."\n\
  apache2-foreground' > /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh
# Start Apache
CMD ["/usr/local/bin/start.sh"]
