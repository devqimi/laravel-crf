<?php

namespace App\Http\Controllers;

use App\Exports\CrfExport;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function exportCrf(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'action_by_vendor' => 'nullable|string',
            'action_by_itd' => 'nullable|string',
            'categories' => 'nullable|string',
            'factors' => 'nullable|string',
            'report_type' => 'nullable|in:all,pending,in_progress,completed',
        ]);

        $startDate = Carbon::parse($request->start_date)->startOfDay();
        $endDate = Carbon::parse($request->end_date)->endOfDay();
        $actionByVendor = $request->input('action_by_vendor');
        $actionByITD = $request->input('action_by_itd');
        $categories = $request->categories ? explode(',', $request->categories) : [];
        $factors = $request->input('factors') ? explode(',', $request->input('factors')) : [];
        $reportType = $request->report_type ?? 'all';

        $filename = 'CRF_Report_' . $startDate->format('Y-m-d') . '_to_' . $endDate->format('Y-m-d') . '.xlsx';

        return Excel::download(
            new CrfExport($startDate, $endDate, $actionByITD, $actionByVendor, $categories, $factors, $reportType),
            $filename,
            \Maatwebsite\Excel\Excel::XLSX
        );
    }
}