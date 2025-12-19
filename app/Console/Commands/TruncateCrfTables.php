<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class TruncateCrfTables extends Command
{
    protected $signature = 'crf:reset';
    protected $description = 'Reset all CRF-related tables to zero';

    public function handle()
    {
        if (!$this->confirm('This will DELETE ALL CRF data. Are you sure?')) {
            $this->info('Operation cancelled.');
            return;
        }

        $this->info('Resetting CRF tables...');

        // Disable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // Truncate tables
        DB::table('crf_status_timeline')->truncate();
        DB::table('crf_remarks')->truncate();
        DB::table('crf_attachments')->truncate();
        DB::table('crforms')->truncate();
        
        // Delete CRF-related notifications only
        DB::table('notifications')
            ->where('type', 'like', '%Crf%')
            ->delete();

        // Re-enable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $this->info('✅ All CRF tables have been reset!');
    }
}