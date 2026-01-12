<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('categories')
            ->where('cname', 'Hardware Relocation')
            ->update([
                'cname' => 'Hardware Request/Relocation',
            ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert back to original name
        DB::table('categories')
            ->where('cname', 'Hardware Request/Relocation')
            ->update([
                'cname' => 'Hardware Relocation',
            ]);
    }
};
