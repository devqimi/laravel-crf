<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('crforms', function (Blueprint $table) {
            $table->timestamp('approved_by_hou_at')->nullable()->after('approved_by');
            $table->timestamp('approved_by_tp_at')->nullable()->after('approved_by_hou_at');
        });
    }

    public function down(): void
    {
        Schema::table('crforms', function (Blueprint $table) {
            $table->dropColumn(['approved_by_hou_at', 'approved_by_tp_at']);
        });
    }
};
