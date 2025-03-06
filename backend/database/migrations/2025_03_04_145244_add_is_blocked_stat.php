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
    Schema::table('users', function (Blueprint $table) {
      $table->boolean('is_blocked')->default(false);
      $table->timestamp('blocked_until')->nullable()->default(null);
    });
  }

  public function down()
  {
    Schema::table('users', function (Blueprint $table) {

      $table->dropColumn('is_blocked');
      $table->dropColumn('blocked_until');
    });
  }
};
