<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
  /**
   * Run the migrations.
   */
  public function up(): void
  {
    DB::statement("
          CREATE TABLE users (
              id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
              name VARCHAR(255) NOT NULL,
              email VARCHAR(255) UNIQUE NOT NULL,
              password VARCHAR(255) NOT NULL,
              varsity VARCHAR(255) NULL,
              department VARCHAR(255) NULL,
              role VARCHAR(50) NOT NULL DEFAULT 'user',
              points INT NOT NULL DEFAULT 0,
              google_id VARCHAR(255) NULL,
              email_verified_at TIMESTAMP NULL,
              remember_token VARCHAR(100) NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          )
      ");
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::table('users', function (Blueprint $table) {

      DB::statement("DROP TABLE IF EXISTS users");
    });
  }
};
