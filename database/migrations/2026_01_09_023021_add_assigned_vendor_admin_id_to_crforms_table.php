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
            $table->integer('assigned_vendor_admin_id')->nullable()->after('assigned_to');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('crforms', function (Blueprint $table) {
            $table->dropColumn('assigned_vendor_admin_id');
        });
    }
};