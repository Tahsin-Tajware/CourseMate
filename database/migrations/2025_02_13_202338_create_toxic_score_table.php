<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  /**
   * Run the migrations.
   */
  public function up(): void
  {
    Schema::create('toxic_score', function (Blueprint $table) {
      $table->id();
      $table->integer('toxic_score');
      $table->foreignId('comment_id')->constrained('comment')->noActionOnDelete();
      $table->foreignId('user_id')->constrained('users')->noActionOnDelete();
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('toxic_score');
  }
};
