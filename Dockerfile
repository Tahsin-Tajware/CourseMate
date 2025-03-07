# Use official PHP image with necessary extensions
FROM php:8.2.12-fpm

# Set working directory
WORKDIR /var/www/html

# Install dependencies
RUN apt-get update && apt-get install -y \
  libpq-dev \
  zip \
  unzip \
  git \
  curl \
  libonig-dev \
  && docker-php-ext-install pdo pdo_pgsql mbstring

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy Laravel backend files
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Set permissions for Laravel storage and cache
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Install Node.js & NPM for React frontend
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
  apt-get install -y nodejs

# Install npm dependencies for React frontend
WORKDIR /var/www/html/react
RUN npm install

# Build React frontend
RUN npm run build

# Set working directory back to Laravel root
WORKDIR /var/www/html

# Expose port for PHP-FPM
EXPOSE 9000

# Start PHP-FPM
CMD ["php-fpm"]
