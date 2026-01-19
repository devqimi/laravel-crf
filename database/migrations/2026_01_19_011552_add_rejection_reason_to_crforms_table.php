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
        Schema::table('crforms', function (Blueprint $table) {
            $table->text('rejection_reason')->nullable()->after('it_remark');
            $table->integer('rejected_by')->nullable()->after('rejection_reason');
            $table->timestamp('rejected_at')->nullable()->after('rejected_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('crforms', function (Blueprint $table) {
            $table->dropColumn(['rejection_reason', 'rejected_by', 'rejected_at']);
        });
    }
};