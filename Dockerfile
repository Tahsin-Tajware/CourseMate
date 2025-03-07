# Use official PHP image with necessary extensions
FROM php:8.2-fpm

# Set working directory
WORKDIR /var/www/html

# Install dependencies
RUN apt-get update && apt-get install -y \
  libpng-dev \
  libjpeg-dev \
  libfreetype6-dev \
  zip \
  unzip \
  git \
  curl \
  libonig-dev \
  && docker-php-ext-install pdo pdo_mysql mbstring gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy Laravel backend files
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Install Node.js & NPM for React frontend
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
  apt-get install -y nodejs

# Build React frontend
WORKDIR /var/www/html/react
RUN npm install && npm run build

# Set up Laravel environment
WORKDIR /var/www/html
RUN php artisan cache:clear && php artisan config:clear && php artisan config:cache

# Expose port
EXPOSE 9000

# Start PHP-FPM
CMD ["php-fpm"]
