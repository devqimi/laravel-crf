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
            // Use unsignedInteger since users.id is INT
            $table->Integer('it_hou_approved_by')->nullable()->after('tp_approved_by');
            $table->timestamp('it_hou_approved_at')->nullable()->after('approved_by_tp_at');
            
            // Add foreign key constraint
            $table->foreign('it_hou_approved_by')
                ->references('id')
                ->on('users')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('crforms', function (Blueprint $table) {
            $table->dropForeign(['it_hou_approved_by']);
            $table->dropColumn(['it_hou_approved_by', 'it_hou_approved_at']);
        });
    }
};
