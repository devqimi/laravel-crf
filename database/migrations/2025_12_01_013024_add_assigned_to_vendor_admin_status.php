<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        DB::table('application_statuses')->insert([
            'status' => 'Assigned to Vendor Admin',
        ]);
    }

    public function down()
    {
        DB::table('application_statuses')
            ->where('status', 'Assigned to Vendor Admin')
            ->delete();
    }
};