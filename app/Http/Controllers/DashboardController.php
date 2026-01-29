<?php

namespace App\Http\Controllers;

use App\Models\Crf;
use App\Models\User;
use App\Models\Category;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $departmentCrfs = null;
        $stats = null;
        $chartData = null;
        $isAdminOrHOU = false;
        $isPIC = false;
        $recentActivities = null;
        $latestCrf = null;

        // if user can view all CRFs
        if (Gate::allows('View ALL CRF')) {
            $crfs = Crf::with(['department', 'category', 'factor', 'user', 'application_status', 'approver', 'assigned_user'])
            ->latest()
            ->paginate(10);

            $departmentCrfs = null;
            $isAdminOrHOU = true;
            $recentActivities = $this->getAdminHouRecentActivities($user->id);
        }
        
        // ITD ADMIN can view both "assigned to ITD" and "assigned to Vendor" CRFs
        elseif (Gate::allows('View ITD CRF') && Gate::allows('View Vendor CRF')) {
            $crfs = Crf::with(['department', 'category', 'factor', 'user', 'application_status', 'approver', 'assigned_user'])
            ->where('application_status_id', '>=', 2)
            ->latest()
            ->paginate(10);

            $departmentCrfs = null;
            $isAdminOrHOU = true;
            $recentActivities = $this->getAdminHouRecentActivities($user->id);
        }

        // TP approve
        elseif (Gate::allows('approved by TP')) {
            // TP can view CRFs that need their approval (status 10)
            $crfs = Crf::with(['department', 'category', 'factor', 'user', 'application_status', 'approver', 'assigned_user'])
                ->where('application_status_id', 10) // Verified by HOU, awaiting TP
                ->latest()
                ->paginate(10);
            
            $departmentCrfs = null;
            $isAdminOrHOU = true;
            $recentActivities = $this->getAdminHouRecentActivities($user->id, $user->department_id);
        }

        // IT ASSIGN view approved crf by hou
        elseif (Gate::allows('Assign CRF To ITD') && Gate::allows('Assign CRF to Vendor')) {
            $crfs = Crf::with(['department', 'category', 'factor', 'user', 'application_status', 'approver', 'assigned_user'])
                ->where('application_status_id', [2, 11])
                ->latest()
                ->paginate(10);

            $isAdminOrHOU = false;
            $stats = [
                'my_total' => Crf::where('application_status_id', 2)->count(),
                'my_pending' => Crf::where('application_status_id', 2)->count(),
                'my_in_progress' => 0,
                'my_completed' => 0,
                'my_this_month' => 0,
            ];
        }

        // VENDOR ADMIN can view CRFs assigned to them
        elseif (Gate::allows('Assign Vendor PIC')) {
            $crfs = Crf::with(['department', 'category', 'factor', 'user', 'application_status', 'approver', 'assigned_user', 'assignedVendorAdmin'])
                ->where('assigned_vendor_admin_id', $user->id)
                ->whereIn('application_status_id', [12]) // 12 = Assigned to Vendor Admin
                ->latest()
                ->paginate(10);

            $isAdminOrHOU = true;
            $stats = [
                'my_total' => Crf::where('assigned_vendor_admin_id', $user->id)->count(),
                'my_pending' => Crf::where('assigned_vendor_admin_id', $user->id)->where('application_status_id', 12)->count(),
                'my_in_progress' => Crf::where('assigned_vendor_admin_id', $user->id)->where('application_status_id', 8)->count(),
                'my_completed' => Crf::where('assigned_vendor_admin_id', $user->id)->where('application_status_id', 9)->count(),
                'my_this_month' => 0,
            ];
        }

        // HOU can verify CRFs from their department
        elseif (Gate::allows('verified CRF') && Gate::allows('View Department CRF')) {

                $crfs = Crf::with(['department', 'category', 'factor', 'user', 'application_status', 'approver' , 'assigned_user'])
                ->where('department_id', $user->department_id)
                ->where('application_status_id', 1)
                ->latest()
                ->paginate(10);
                
                $departmentCrfs = Crf::with(['department', 'category', 'factor', 'user', 'application_status', 'approver', 'assigned_user'])
                ->where('department_id', $user->department_id)
                ->whereIn('application_status_id', [2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
                ->latest()
                ->get();

                $recentActivities = $this->getAdminHouRecentActivities($user->id, $user->department_id);
                $isAdminOrHOU = true;
        }
        
        // ITD PIC can only view ITD CRFs assigned
        elseif (Gate::allows('View ITD CRF')) {
            $crfs = Crf::with(['department', 'category', 'factor', 'user', 'application_status', 'approver', 'assigned_user'])
            ->where('assigned_to', $user->id) // Only CRFs assigned to this user
            ->whereIn('application_status_id', [4, 6, 8, 9]) // Assigned to ITD, Reassigned to ITD, Work in progress, Closed
            ->latest()
            ->paginate(10);

            $isPIC = true;
            $departmentCrfs = null;

            // PIC stats - their assigned CRFs
            $stats = [
                'my_total' => Crf::where('assigned_to', $user->id)->count(),
                'my_pending' => Crf::where('assigned_to', $user->id)
                    ->whereIn('application_status_id', [4, 6])->count(), // Assigned, waiting to start
                'my_in_progress' => Crf::where('assigned_to', $user->id)
                    ->where('application_status_id', 8)->count(), // Work in progress
                'my_completed' => Crf::where('assigned_to', $user->id)
                    ->where('application_status_id', 9)->count(),
                'my_this_month' => Crf::where('assigned_to', $user->id)
                    ->where('created_at', '>=', Carbon::now()->startOfMonth())->count(),
            ];

            // Recent activities for PIC
            $recentActivities = $this->getPICRecentActivities($user->id);
        }
        
        // if user can view Vendor CRFs
        elseif (Gate::allows('View Vendor CRF')) {
            $crfs = Crf::with(['department', 'category', 'factor', 'user', 'application_status', 'approver', 'assigned_user'])
            ->where('assigned_to', $user->id) // Only CRFs assigned to this user
            ->whereIn('application_status_id', [5, 7, 8, 9]) // Assigned to Vendor, Reassigned to Vendor, Work in progress, Closed
            ->latest()
            ->paginate(10);

            $isPIC = true;
            $departmentCrfs = null;

            // Vendor PIC stats - their assigned CRFs
            $stats = [
                'my_total' => Crf::where('assigned_to', $user->id)->count(),
                'my_pending' => Crf::where('assigned_to', $user->id)
                    ->whereIn('application_status_id', [5, 7])->count(), // Assigned, waiting to start
                'my_in_progress' => Crf::where('assigned_to', $user->id)
                    ->where('application_status_id', 8)->count(), // Work in progress
                'my_completed' => Crf::where('assigned_to', $user->id)
                    ->where('application_status_id', 9)->count(),
                'my_this_month' => Crf::where('assigned_to', $user->id)
                    ->where('created_at', '>=', Carbon::now()->startOfMonth())->count(),
            ];

            $recentActivities = $this->getPICRecentActivities($user->id);
        }
        
        // user can only view their own CRFs
        elseif (Gate::allows('View Personal CRF')) {
            $crfs = Crf::with(['department', 'category', 'factor', 'user', 'application_status', 'approver', 'assigned_user'])
            ->where('user_id', $user->id)
            ->latest()
            ->paginate(10);

            $departmentCrfs = null;

            // Calculate "My CRFs" stats
            $stats = $this->getMyStats($user->id);

            // Get recent activities
            $recentActivities = $this->getRecentActivities($user->id);

            // Get latest CRF
            $latestCrf = Crf::where('user_id', $user->id)
                ->with(['application_status', 'assigned_user'])
                ->latest()
                ->first();

            $chartData = null; // Regular users don't see charts
        }

        // No permission at all
        else {
            abort(403, 'Unauthorized to view CRFs');
        }

        // Only calculate admin stats and charts for admin/HOU users
        if ($isAdminOrHOU) {
            $stats = [
                'total' => Crf::count(),
                'pending' => Crf::whereIn('application_status_id', [1, 10, 11])->count(),
                'in_progress' => Crf::whereIn('application_status_id', [2, 3, 4, 5, 6, 7, 8, 12])->count(),
                'completed' => Crf::where('application_status_id', 9)->count(),
            ];

            $chartData = [
                'trendData' => $this->getTrendData(),
                'departmentData' => $this->getDepartmentData(),
            ];
        }
        
        $itdPics = User::role('ITD PIC')->select('id', 'name')->get();
        $vendorPics = User::role('VENDOR PIC')->select('id', 'name')->get();
        $vendorAdmins = User::role('VENDOR ADMIN')->select('id','name')->get();

        return Inertia::render('dashboard', [
            'crfs' => $crfs,
            'stats' => $stats,
            'chartData' => $chartData,
            'isAdminOrHOU' => $isAdminOrHOU,
            'isPIC' => $isPIC,
            'department_crfs' => $departmentCrfs,
            'recent_activities' => $recentActivities,
            'latest_crf' => $latestCrf,
            'can_view' =>Gate::allows('View Personal CRF'),
            'can_view_department' => Gate::allows('View Department CRF'),
            'can_delete' =>Gate::allows('Close Assigned CRF'),
            'can_create' => Gate::allows('Create CRF'),
            'can_approve' => Gate::allows('verified CRF'),
            'can_acknowledge' => Gate::allows('Acknowledge CRF by ITD'),
            'can_assign_itd' => Gate::allows('Assign CRF To ITD') || Gate::allows('Re Assign PIC ITD'),
            'can_assign_vendor' => Gate::allows('Assign CRF to Vendor') || Gate::allows('Re Assign PIC Vendor'),
            'can_update_own_crf' => Gate::allows('Update CRF (own CRF)'),
            'can_assign_by_it' => Gate::allows('Assign CRF To ITD') && Gate::allows('Assign CRF to Vendor'),
            'can_assign_vendor_pic' => Gate::allows('Assign Vendor PIC'),
            'categories' => Category::all(),
            'itd_pics' => $itdPics,
            'vendor_pics' => $vendorPics,
            'vendor_admins' => $vendorAdmins,
            'can_approve_tp' => Gate::allows('approved by TP'),
        ]);
    }

    private function getRecentActivities($userId)
    {
        return Crf::where('user_id', $userId)
            ->with('application_status')
            ->latest('updated_at')
            ->take(5)
            ->get()
            ->map(function ($crf) {
                return [
                    'id' => $crf->id,
                    'crf_id' => $crf->id,
                    'message' => "CRF {$crf->crf_number} - {$crf->application_status->status}",
                    'type' => $this->getActivityType($crf->application_status_id),
                    'created_at' => $crf->updated_at->toIso8601String(),
                ];
            });
    }

    private function getPICRecentActivities($userId)
    {
        return Crf::where('assigned_to', $userId)
            ->with('application_status', 'user')
            ->latest('updated_at')
            ->take(5)
            ->get()
            ->map(function ($crf) {
                return [
                    'id' => $crf->id,
                    'crf_id' => $crf->id,
                    'message' => "CRF #{$crf->id} from {$crf->user->name} - {$crf->application_status->status}",
                    'type' => $this->getActivityType($crf->application_status_id),
                    'created_at' => $crf->updated_at->toIso8601String(),
                ];
            });
    }

    private function getAdminHouRecentActivities($userId, $departmentId = null)
    {
        $query = Crf::with('application_status', 'user', 'department');

        // If departmentId is provided, filter by department (for HOU)
        if ($departmentId) {
            $query->where('department_id', $departmentId);
        }

        return $query
            ->latest('updated_at')
            ->take(5)
            ->get()
            ->map(function ($crf) {
                return [
                    'id' => $crf->id,
                    'crf_id' => $crf->id,
                    'message' => "CRF {$crf->crf_number} from {$crf->user->name} ({$crf->department->dname}) - {$crf->application_status->status}",
                    'type' => $this->getActivityType($crf->application_status_id),
                    'created_at' => $crf->updated_at->toIso8601String(),
                ];
            });
    }

    private function getActivityType($statusId)
    {
        switch ($statusId) {
            case 1:
                return 'pending';
            case 2:
            case 10:
            case 11:
                return 'approved';
            case 8:
                return 'in_progress';
            case 9:
                return 'completed';
            default:
                return 'pending';
        }
    }

    private function getTrendData()
    {
        return [
            'daily' => $this->getDailyTrend(),
            'weekly' => $this->getWeeklyTrend(),
            'monthly' => $this->getMonthlyTrend(),
        ];
    }

    private function getDailyTrend()
    {
        $days = 14; // Last 14 days
        $data = [];

        for ($i = $days - 1; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $startOfDay = $date->copy()->startOfDay();
            $endOfDay = $date->copy()->endOfDay();

            $data[] = [
                'date' => $date->format('M d'),
                'total' => Crf::whereBetween('created_at', [$startOfDay, $endOfDay])->count(),
                'pending' => Crf::whereBetween('created_at', [$startOfDay, $endOfDay])
                    ->whereIn('application_status_id', [1, 10, 11])->count(),
                'inProgress' => Crf::whereBetween('created_at', [$startOfDay, $endOfDay])
                    ->whereIn('application_status_id', [2, 3, 4, 5, 6, 7, 8, 12])->count(),
                'completed' => Crf::whereBetween('created_at', [$startOfDay, $endOfDay])
                    ->where('application_status_id', 9)->count(),
            ];
        }

        return $data;
    }

    private function getWeeklyTrend()
    {
        $weeks = 8; // Last 8 weeks
        $data = [];

        for ($i = $weeks - 1; $i >= 0; $i--) {
            $startOfWeek = Carbon::now()->subWeeks($i)->startOfWeek();
            $endOfWeek = Carbon::now()->subWeeks($i)->endOfWeek();

            $data[] = [
                'date' => 'Week ' . $startOfWeek->format('M d'),
                'total' => Crf::whereBetween('created_at', [$startOfWeek, $endOfWeek])->count(),
                'pending' => Crf::whereBetween('created_at', [$startOfWeek, $endOfWeek])
                    ->whereIn('application_status_id', [1, 10, 11])->count(),
                'inProgress' => Crf::whereBetween('created_at', [$startOfWeek, $endOfWeek])
                    ->whereIn('application_status_id', [2, 3, 4, 5, 6, 7, 8, 12])->count(),
                'completed' => Crf::whereBetween('created_at', [$startOfWeek, $endOfWeek])
                    ->where('application_status_id', 9)->count(),
            ];
        }

        return $data;
    }

    private function getMonthlyTrend()
    {
        $months = 6; // Last 6 months
        $data = [];

        for ($i = $months - 1; $i >= 0; $i--) {
            $startOfMonth = Carbon::now()->subMonths($i)->startOfMonth();
            $endOfMonth = Carbon::now()->subMonths($i)->endOfMonth();

            $data[] = [
                'date' => $startOfMonth->format('M Y'),
                'total' => Crf::whereBetween('created_at', [$startOfMonth, $endOfMonth])->count(),
                'pending' => Crf::whereBetween('created_at', [$startOfMonth, $endOfMonth])
                    ->whereIn('application_status_id', [1, 10, 11])->count(),
                'inProgress' => Crf::whereBetween('created_at', [$startOfMonth, $endOfMonth])
                    ->whereIn('application_status_id', [2, 3, 4, 5, 6, 7, 8, 12])->count(),
                'completed' => Crf::whereBetween('created_at', [$startOfMonth, $endOfMonth])
                    ->where('application_status_id', 9)->count(),
            ];
        }

        return $data;
    }

    private function getDepartmentData()
    {

        $user = Auth::user();
        $userRoles = $user->roles->pluck('name')->toArray();

        $query = \App\Models\Department::select('dname as department')
            ->withCount([
                'crfs as total',
                'crfs as pending' => function ($query) {
                    // pending status -> until approved by hou it
                    $query->whereIn('application_status_id', [1, 10, 11]);
                },
                'crfs as inProgress' => function ($query) {
                    $query->whereIn('application_status_id', [2, 3, 4, 5, 6, 7, 8, 12]);
                },
                'crfs as completed' => function ($query) {
                    $query->where('application_status_id', 9);
                },
            ]);

        // ITD - see all crf count
        if (in_array('ITD ADMIN', $userRoles) || in_array('IT ASSIGN', $userRoles)) {
            return $query
            ->having('total', '>', 0)
            ->orderBy('total', 'desc')
            ->limit(10)
            ->get()
            ->toArray();
        }

        // HOU - See ONLY their department
        elseif (in_array('HOU', $userRoles) || in_array('TIMBALAN PENGARAH', $userRoles)) {
            return $query
                ->where('id', $user->department_id) // Filter by user's department
                ->having('total', '>', 0)
                ->get()
                ->toArray();
        }

        // VENDOR ADMIN or VENDOR PIC - See only CRFs assigned to them (by department breakdown)
        elseif (in_array('VENDOR ADMIN', $userRoles) || in_array('VENDOR PIC', $userRoles)) {

            // Show department breakdown for only assigned CRFs
            return \App\Models\Department::select('dname as department')
                ->withCount([
                    'crfs as total',
                    'crfs as pending' => function ($query) {
                        $query->whereIn('application_status_id', [1, 10, 11]);
                    },
                    'crfs as inProgress' => function ($query) {
                        $query->whereIn('application_status_id', [2, 3, 4, 5, 6, 7, 8, 12]);
                    },
                    'crfs as completed' => function ($query) {
                        $query->where('application_status_id', 9);
                    },
                ])
                ->having('total', '>', 0)
                ->orderBy('total', 'desc')
                ->limit(10)
                ->get()
                ->toArray();
        }
    }

    private function getMyStats($userId)
    {
        $startOfMonth = Carbon::now()->startOfMonth();
        
        return [
            'my_total' => Crf::where('user_id', $userId)->count(),
            'my_pending' => Crf::where('user_id', $userId)
                ->whereIn('application_status_id', [1, 10, 11])->count(),
            'my_in_progress' => Crf::where('user_id', $userId)
                ->whereIn('application_status_id', [2, 3, 4, 5, 6, 7, 8, 12])->count(),
            'my_completed' => Crf::where('user_id', $userId)
                ->where('application_status_id', 9)->count(),
            'my_this_month' => Crf::where('user_id', $userId)
                ->where('created_at', '>=', $startOfMonth)->count(),
        ];
    }
}