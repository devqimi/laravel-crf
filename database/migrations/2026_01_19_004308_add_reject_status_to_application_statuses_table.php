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
        DB::table('application_statuses')->insert([
            [
                'id' => 13,
                'status' => 'Rejected by HOU',
            ],
            [
                'id' => 14,
                'status' => 'Rejected by TP',
            ],
            [
                'id' => 15,
                'status' => 'Rejected by HOU IT',
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('application_statuses')->whereIn('id', [13, 14, 15])->delete();
    }
};
