<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  /**
   * Run the migrations.
   */
  public function up()
  {
    Schema::table('users', function (Blueprint $table) {
      $table->string('google_id', 50)->nullable()->change(); // Change the type to VARCHAR(50)
    });
  }

  public function down()
  {
    Schema::table('users', function (Blueprint $table) {
      $table->bigInteger('google_id')->nullable()->change(); // Revert back if needed
    });
  }
};
