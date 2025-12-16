<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ApplicationStatusSeeder extends Seeder
{
    public function run()
    {
        $statuses = [
            ['id' => 1, 'status' => 'First Created'],
            ['id' => 2, 'status' => 'Approved by HOU IT'],
            ['id' => 3, 'status' => 'ITD Acknowledged'],
            ['id' => 4, 'status' => 'Assigned to ITD'],
            ['id' => 5, 'status' => 'Assigned to Vendor'],
            ['id' => 6, 'status' => 'Reassigned to ITD'],
            ['id' => 7, 'status' => 'Reassigned to Vendor'],
            ['id' => 8, 'status' => 'Work in progress'],
            ['id' => 9, 'status' => 'Closed'],
            ['id' => 10, 'status' => 'Approved by HOU'],
            ['id' => 11, 'status' => 'Approved by TP'],
            ['id' => 12, 'status' => 'Assigned to Vendor Admin'],
        ];

        foreach ($statuses as $status) {
            DB::table('application_statuses')->updateOrInsert(
                ['id' => $status['id']],
                [
                    'status' => $status['status'],
                ]
            );
        }

        $this->command->info('Application statuses synced successfully!');
        $this->command->info('Total statuses: ' . count($statuses));
    }
}