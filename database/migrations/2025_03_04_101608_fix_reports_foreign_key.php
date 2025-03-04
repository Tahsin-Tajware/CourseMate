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
    Schema::table('reports', function (Blueprint $table) {
      //$table->dropForeign(['comment_id']);


      $table->foreign('comment_id')
        ->references('id')
        ->on('comment')
        ->onDelete('cascade');
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::table('reports', function (Blueprint $table) {
      //
    });
  }
};
