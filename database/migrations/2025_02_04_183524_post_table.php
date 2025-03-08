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
    Schema::create('posts', function (Blueprint $table) {
      $table->id();
      $table->string('title');
      $table->text('content');
      $table->boolean('is_anonymous')->default(false);

      $table->unsignedBigInteger('user_id')->nullable();
      $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
      $table->timestamps();
    });
    Schema::create('post_tag', function (Blueprint $table) {
      $table->id();
      $table->foreignIdFor(\App\Models\Post::class)->constrained()->cascadeOnDelete();
      $table->foreignIdFor(\App\Models\Tag::class)->constrained()->cascadeOnDelete();
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('posts');
    Schema::dropIfExists('post_tag'); // Drop the pivot table first
    Schema::dropIfExists('tags'); // Drop the tags table
  }
};
