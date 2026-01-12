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
        DB::table('categories')->insert([
            'id' => '6',
            'cname' => 'Database',
        ]); 
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove "Database" category
        DB::table('categories')
            ->where('cname', 'Database')
            ->delete();
    }
};
