# Use official PHP image with Apache and necessary extensions
FROM php:8.2.12-apache

# Set working directory
WORKDIR /var/www/html

# Install dependencies for PHP, Composer, and Apache
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

# Install Node.js & NPM for React frontend
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
  apt-get install -y nodejs

# Copy Laravel backend files
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Set permissions for Laravel storage and cache
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Build React frontend
WORKDIR /var/www/html/react
RUN npm install
RUN npm run build

# Copy React build to Laravel's public folder
RUN cp -r build/* /var/www/html/public/

# Expose necessary ports (Apache typically runs on port 80)
EXPOSE 80

# Enable Apache mod_rewrite for Laravel (important for routes)
RUN a2enmod rewrite


# Start Apache server
CMD ["apache2-foreground"]
