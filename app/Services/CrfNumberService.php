<?php

namespace App\Services;

use App\Models\Crf;
use Illuminate\Support\Facades\DB;

class CrfNumberService
{
    /**
     * Generate next CRF number in format: YYYY/MM/NNN
     * Example: 2026/01/001, 2026/01/002, ..., 2026/02/001
     */
    public static function generateCrfNumber(): string
    {
        $year = date('Y');
        $month = date('m');
        $prefix = "{$year}/{$month}";

        // Get the last CRF number for current year/month
        $lastCrf = Crf::where('crf_number', 'LIKE', "{$prefix}/%")
            ->orderBy('crf_number', 'desc')
            ->lockForUpdate() // Prevent race condition
            ->first();

        if ($lastCrf) {
            // Extract the serial number from the last CRF
            // e.g., "2026/01/005" -> extract "005" -> increment to "006"
            $lastNumber = (int) substr($lastCrf->crf_number, -3);
            $newNumber = $lastNumber + 1;
        } else {
            // First CRF of the month
            $newNumber = 1;
        }

        // Format as 3-digit zero-padded number
        $serial = str_pad($newNumber, 3, '0', STR_PAD_LEFT);

        return "{$prefix}/{$serial}";
    }

    /**
     * Ensure CRF number is unique (double-check)
     */
    public static function ensureUniqueCrfNumber(): string
    {
        DB::beginTransaction();
        
        try {
            $crfNumber = self::generateCrfNumber();
            
            // Double-check uniqueness
            while (Crf::where('crf_number', $crfNumber)->exists()) {
                // If somehow duplicate, increment
                $parts = explode('/', $crfNumber);
                $serial = (int) $parts[2] + 1;
                $parts[2] = str_pad($serial, 3, '0', STR_PAD_LEFT);
                $crfNumber = implode('/', $parts);
            }
            
            DB::commit();
            return $crfNumber;
            
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}