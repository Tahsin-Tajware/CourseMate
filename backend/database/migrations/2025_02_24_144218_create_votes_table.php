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
        Schema::create('votes', function (Blueprint $table) {
            $table->id();
            // Which user cast this vote
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            // Polymorphic columns: votable_id and votable_type
            $table->morphs('votable');
            // Vote value: 1 for upvote, -1 for downvote
            $table->integer('value');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('votes');
    }
};
