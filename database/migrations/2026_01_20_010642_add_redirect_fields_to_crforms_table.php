<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('crforms', function (Blueprint $table) {
            $table->text('redirect_reason')->nullable()->after('rejection_reason');
            $table->integer('redirected_by')->nullable()->after('redirect_reason');
            $table->timestamp('redirected_at')->nullable()->after('redirected_by');
        });
    }

    public function down(): void
    {
        Schema::table('crforms', function (Blueprint $table) {
            $table->dropColumn(['redirect_reason', 'redirected_by', 'redirected_at']);
        });
    }
};