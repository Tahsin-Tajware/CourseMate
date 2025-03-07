# Multi-stage build for Laravel and React
# Stage 1: Build React application
FROM node:18-alpine as react-builder
WORKDIR /app
COPY ./react ./
RUN npm install
RUN npm run build

# Stage 2: Laravel application
FROM php:8.2-apache
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
RUN docker-php-ext-install pdo pdo_pgsql pgsql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy Laravel files
COPY . /var/www/html/

# Remove React source (we'll use the built version)
RUN rm -rf /var/www/html/react

# Copy built React app to public directory
COPY --from=react-builder /app/build /var/www/html/public/react

# Create .env file if it doesn't exist
RUN if [ ! -f .env ]; then cp .env.example .env; fi

# Install Laravel dependencies
RUN composer install --optimize-autoloader --no-dev

# Generate key and optimize
RUN php artisan key:generate --force
RUN php artisan config:cache
RUN php artisan route:cache
RUN php artisan view:cache

# Configure Apache document root
RUN sed -i 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/000-default.conf

# Set permissions
RUN chown -R www-data:www-data /var/www/html
RUN chmod -R 755 /var/www/html/storage /var/www/html/bootstrap/cache

# Expose port 80
EXPOSE 80

# Start script to run migrations and start Apache
RUN echo '#!/bin/bash\ncd /var/www/html\nphp artisan migrate --force\napache2-foreground' > /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

# Start Apache
CMD ["/usr/local/bin/start.sh"]
