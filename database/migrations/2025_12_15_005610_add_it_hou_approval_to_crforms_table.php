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
        Schema::table('crforms', function (Blueprint $table) {
            $table->foreignId('it_hou_approved_by')->nullable()->after('tp_approved_by')->constrained('users')->onDelete('set null');
            $table->timestamp('it_hou_approved_at')->nullable()->after('approved_by_tp_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('crforms', function (Blueprint $table) {
            //
        });
    }
};
