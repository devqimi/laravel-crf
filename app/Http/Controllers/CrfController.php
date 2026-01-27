<?php

namespace App\Http\Controllers;

use App\Notifications;
use App\Models\Crf;
use App\Models\User;
use App\Models\Factor;
use App\Models\ApplicationStatus;
use App\Models\CrfAttachment;
use App\Models\Category;
use App\Models\Department;
use App\Services\CrfNumberService;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use App\Notifications\CrfCreated;
use App\Notifications\CrfApproved;
use App\Notifications\CrfAssigned;
use App\Notifications\CrfRejected;
use App\Notifications\CrfApprovedByHOU;
use App\Notifications\CrfRedirectedNotification;
use App\Notifications\CrfAssignedToVendorPICNotification;
use App\Mail\CrfCreatedMail;
use App\Mail\CrfRejectedMail;
use App\Mail\CrfReassignedMail;
use App\Mail\CrfApprovedByTpMail;
use App\Mail\CrfApprovedByHouMail;
use App\Mail\CrfAssignedToPicMail;
use App\Mail\CrfStatusUpdatedMail;
use App\Mail\CrfApprovedByHouItMail;
use App\Mail\CrfRedirectedToHouItMail;
use App\Mail\CrfAssignedToVendorAdminMail;

class CrfController extends Controller
{

    public function index(Request $request) {

        Log::info('CRF Index Request:', [
            'search' => $request->input('search'),
            'department_id' => $request->input('department_id'),
            'category_id' => $request->input('category_id'),
            'factor_id' => $request->input('factor_id'),
            'all_params' => $request->all()
        ]);

        $user = Auth::user();
        $departmentCrfs = null;
        $isAdmin_HOU_PIC = null;

        $userRoles = $user->roles ? $user->roles->pluck('name')->toArray() : [];
        Log::info('User Roles:', ['roles' => $userRoles, 'type' => gettype($userRoles)]);

        // Get search and filter parameters
        $search = $request->input('search');
        $departmentFilter = $request->input('department_id');
        $categoryFilter = $request->input('category_id');
        $factorFilter = $request->input('factor_id');

        // Get IT Department ID (used multiple times)
        $itDepartmentId = Department::where('dname', 'LIKE', '%Unit Teknologi Maklumat%')
            ->first()?->id;

        $hardwareRelocationCategoryId = Category::where('cname', 'Hardware Request/Relocation')->first()?->id;

        $crfQuery = Crf::with(['department', 'category', 'factor', 'user', 'application_status', 'approver', 'assigned_user']);

        $crfQuery->when($search, function ($query, $search) {
            $query->where('crf_number', 'LIKE', "%{$search}%");
        })
        ->when($departmentFilter, function ($query, $departmentFilter) {
            $query->where('department_id', $departmentFilter);
        })
        ->when($categoryFilter, function ($query, $categoryFilter) {
            $query->where('category_id', $categoryFilter);
        })
        ->when($factorFilter, function ($query, $factorFilter) {
            $query->where('factor_id', $factorFilter);
        });

        $multiRoleCheck = ['ITD ADMIN', 'HOU', 'IT ASSIGN', 'TIMBALAN PENGARAH', 'VENDOR ADMIN'];
        $matchingRoles = array_intersect($userRoles, $multiRoleCheck);

        // if user can view all CRFs
        if (Gate::allows('View ALL CRF')) {
            $crfs = $crfQuery
            ->latest()
            ->paginate(10);

            $departmentCrfs = null;
            $isAdmin_HOU_PIC = true;
        }

        elseif (count($matchingRoles) > 1) {
        
            $statusIds = [];
            $conditions = [];
            
            // ITD ADMIN Role - can see everything from status 2 onwards
            if (in_array('ITD ADMIN', $userRoles)) {
                $crfs = $crfQuery->latest()->paginate(10);
                $isAdmin_HOU_PIC = true;
                // ITD ADMIN overrides all other roles - they see everything
                // Skip other role checks
                goto skip_merge;
            }

            // HOU Role
            if (in_array('HOU', $userRoles)) {
                if ($user->department_id == $itDepartmentId) {
                    // IT HOU - show status 1, 10, 11, 16
                    $statusIds = array_merge($statusIds, [1, 10, 11, 16]);
                    $isAdmin_HOU_PIC = true;

                    // Also prepare department CRFs view
                    $departmentCrfs = Crf::with(['department', 'category', 'factor', 'user', 'application_status', 'approver', 'assigned_user'])
                        ->whereIn('application_status_id', [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
                        ->latest()
                        ->get();
                } else {
                    // Department HOU - show status 1 from their department
                    $conditions[] = function($query) use ($user) {
                        $query->where('department_id', $user->department_id)
                            ->where('application_status_id', 1);
                    };
                    $isAdmin_HOU_PIC = true;

                    // Prepare department CRFs view
                    $departmentCrfs = Crf::with(['department', 'category', 'factor', 'user', 'application_status', 'approver', 'assigned_user'])
                        ->where('department_id', $user->department_id)
                        ->whereIn('application_status_id', [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
                        ->latest()
                        ->get();
                }
            }
            
            // IT ASSIGN Role
            if (in_array('IT ASSIGN', $userRoles)) {
                $statusIds = array_merge($statusIds, [2]); // Status 2 = Approved by HOU IT
                $isAdmin_HOU_PIC = true;
            }
            
            // TIMBALAN PENGARAH Role
            if (in_array('TIMBALAN PENGARAH', $userRoles)) {
                $statusIds = array_merge($statusIds, [10]); // Status 10 = Approved by HOU, Awaiting TP approval
                $isAdmin_HOU_PIC = true;
            }
            
            // VENDOR ADMIN Role
            if (in_array('VENDOR ADMIN', $userRoles)) {
                $conditions[] = function($query) use ($user) {
                    $query->where('assigned_vendor_admin_id', $user->id)
                        ->where('application_status_id', 12);
                };
                $isAdmin_HOU_PIC = true;
            }
            
            // Remove duplicates
            $statusIds = array_unique($statusIds);
            
            // Build the final query
            $crfs = $crfQuery->where(function($query) use ($statusIds, $conditions) {
                // Add status-based conditions
                if (!empty($statusIds)) {
                    $query->whereIn('application_status_id', $statusIds);
                }
                
                // Add custom conditions (like department-specific or vendor admin)
                foreach ($conditions as $condition) {
                    $query->orWhere($condition);
                }
            })
            ->latest()
            ->paginate(10);

            skip_merge:
        }

        // ITD ADMIN
        elseif (in_array('ITD ADMIN', $userRoles)) {
            $crfs = clone $crfQuery
            ->latest()
            ->paginate(10);

            $departmentCrfs = null;
            $isAdmin_HOU_PIC = true;
        }

        // TP approve - for hardware relocation
        elseif (in_array('TIMBALAN PENGARAH', $userRoles)) {
            // TP can view CRFs that need their approval (status 10)
            $crfs = clone $crfQuery;
            $crfs = $crfs
                ->where('category_id', $hardwareRelocationCategoryId)
                ->where('application_status_id', 10) // Approved by HOU, awaiting TP approval
                ->latest()
                ->paginate(10);
            
            $departmentCrfs = null;
            $isAdmin_HOU_PIC = true;
        }

        // IT ASSIGN view approved crf by hou
        elseif (in_array('IT ASSIGN', $userRoles)) {
            $crfs = clone $crfQuery;
            $crfs = $crfs
                ->whereIn('application_status_id', [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]) // IT ASSIGN assigns after approved by HOU IT
                ->latest()
                ->paginate(10);

            $departmentCrfs = null;
            $isAdmin_HOU_PIC = true;
        }

        // VENDOR ADMIN can view CRFs assigned to them
        elseif (in_array('VENDOR ADMIN', $userRoles)) {
            $crfs = clone $crfQuery;
            $crfs = $crfs
                ->where('assigned_vendor_admin_id', $user->id)
                ->whereIn('application_status_id', [5, 7, 8, 9, 12]) // 12 = Assigned to Vendor Admin
                ->latest()
                ->paginate(10);

            $departmentCrfs = null;
            $isAdmin_HOU_PIC = true;
        }

        // HOU can approve CRFs from their department
        elseif (in_array('HOU', $userRoles)) {

            // If HOU is from IT Department, show CRFs waiting for IT HOU approval (status 12 or 11)
            if ($user->department_id == $itDepartmentId) {
                $crfs = clone $crfQuery;
                $crfs = $crfs
                    ->whereIn('application_status_id', [10, 11]) // Approved by HOU (10) or Approved by TP (11)
                    ->latest()
                    ->paginate(10);

                // Show all other CRFs that have been processed
                $departmentCrfs = Crf::with(['department', 'category', 'factor', 'user', 'application_status', 'approver', 'assigned_user'])
                    ->whereIn('application_status_id', [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
                    ->latest()
                    ->get();

                $isAdmin_HOU_PIC = true;
            }
            // If HOU is from other departments, show CRFs from their department (status 1)
            else {
                $crfs = clone $crfQuery;
                $crfs = $crfs
                    ->where('department_id', $user->department_id)
                    ->where('application_status_id', 1) // First Created
                    ->latest()
                    ->paginate(10);
                
                // Show all other CRFs from their department that have been processed
                $departmentCrfs = Crf::with(['department', 'category', 'factor', 'user', 'application_status', 'approver', 'assigned_user'])
                    ->where('department_id', $user->department_id)
                    ->whereIn('application_status_id', [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
                    ->latest()
                    ->get();

                $isAdmin_HOU_PIC = true;
            }
        }
        
        // ITD PIC can only view ITD CRFs assigned
        elseif (in_array('ITD PIC', $userRoles)) {
            $crfs = clone $crfQuery;
            $crfs = $crfs
                ->where('assigned_to', $user->id)
                ->whereIn('application_status_id', [4, 6, 8, 9]) // Assigned to ITD, Reassigned to ITD, Work in progress, Closed
                ->latest()
                ->paginate(10);

            $departmentCrfs = null;
            $isAdmin_HOU_PIC = true;
        }
        
        // Vendor PIC can only view Vendor CRFs assigned
        elseif (in_array('VENDOR PIC', $userRoles)) {
            $crfs = clone $crfQuery;
            $crfs = $crfs
                ->where('assigned_to', $user->id)
                ->whereIn('application_status_id', [5, 7, 8, 9]) // Assigned to Vendor, Reassigned to Vendor, Work in progress, Closed
                ->latest()
                ->paginate(10);

            $departmentCrfs = null;
            $isAdmin_HOU_PIC = true;
        }
        
        // regular user can only view their own CRFs
        elseif (in_array('USER', $userRoles)) {
            $crfs = clone $crfQuery;
            $crfs = $crfs
                ->where('user_id', $user->id)
                ->latest()
                ->paginate(10);

            $departmentCrfs = null;
            $isAdmin_HOU_PIC = false;
        }

        // No permission at all
        else {
            abort(403, 'Unauthorized to view CRFs');
        }
        
        $itdPics = User::role('ITD PIC')->select('id', 'name')->get();
        $vendorPics = User::role('VENDOR PIC')->select('id', 'name')->get();
        $vendorAdmins = User::role('VENDOR ADMIN')->select('id','name')->get();

        return Inertia::render('crfs/index', [
            'crfs' => $crfs,
            'department_crfs' => $departmentCrfs,
            'departments' => Department::select('id', 'dname')->orderBy('dname')->get(),
            'can_view' =>Gate::allows('View CRF Detail'),
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
            'factors' => Factor::all(),
            'itd_pics' => $itdPics,
            'vendor_pics' => $vendorPics,
            'vendor_admins' => $vendorAdmins,
            'can_approve_tp' => Gate::allows('approved by TP'),
            'is_it_hou' => $user->department_id == $itDepartmentId && Gate::allows('verified CRF'),
            'is_admin_hou_pic' => $isAdmin_HOU_PIC,
        ]);
    }
    
    public function create(Request $request)
    {
        /** @var \App\Models\User|null $user */
        $user = $request->user();
            
        if (!$user) {
            abort(403, 'User not authenticated.');
        }
        
        $user->load('department');
        
        $departments = Department::select('id', 'dname')->get();
        $categories = Category::select('id', 'cname')->get();
        
        return Inertia::render('crfs/create', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'nric' => $user->nric,
                'email' => $user->email,
                'designation' => $user->designation,
                'extno' => $user->extno,
                'department_id' => $user->department_id,
                'department_name' => $user->department?->dname,
            ],
            'departments' => $departments,
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {

        // Add logging
        Log::info('=== CRF Store Method Started ===');
        Log::info('Has supporting_file in request: ' . ($request->has('supporting_file') ? 'YES' : 'NO'));
        Log::info('Has file: ' . ($request->hasFile('supporting_file') ? 'YES' : 'NO'));
        
        if ($request->hasFile('supporting_file')) {
            Log::info('File count: ' . count($request->file('supporting_file')));
        }

        try {

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'nric' => 'required|string|max:20',
                'department_id' => 'required|exists:departments,id',
                'designation' => 'required|string|max:255',
                'extno' => 'required|string|max:10',
                'category_id' => 'required|exists:categories,id',
                'factor_id' => 'nullable|exists:factors,id',
                'issue' => 'required|string|max:255',
                'reason' => 'nullable|string|max:255',
                'supporting_file' => 'nullable|array',
                'supporting_file.*' => 'file|mimes:jpg,jpeg,gif,pdf,doc,docx,xls,xlsx|max:5120',
            ]);
    
            Log::info('Validation passed');
    
            // Debug: Check if files are present
            Log::info('Has files: ' . ($request->hasFile('supporting_file') ? 'YES' : 'NO'));
            
            $validated['application_status_id'] = 1;
            
            // Map 'name' to 'fname' for the database
            $validated['fname'] = $validated['name'];
            unset($validated['name']);
            
            // Add the current logged-in user ID
            $validated['user_id'] = Auth::id();

            $validated['crf_number'] = CrfNumberService::ensureUniqueCrfNumber();
            
            $crf = Crf::create($validated);
            
            if ($request->hasFile('supporting_file')) {
                Log::info('Number of files: ' . count($request->file('supporting_file')));
            }
            
            // Handle file upload if present
            if ($request->hasFile('supporting_file') && is_array($request->file('supporting_file'))) {
                
                foreach($request->file('supporting_file') as $file){
                    
                    $filename = time() . '_' . bin2hex(random_bytes(4)) . '.' . $file->getClientOriginalExtension();
                    $path = $file->storeAs("crfs/{$crf->id}", $filename, 'public');
                    
                    Log::info('File stored: ' . $path);
                    
                    $attachment = CrfAttachment::create([
                        'crf_id' => $crf->id,
                        'filename' => $file->getClientOriginalName(),
                        'path' => $path,
                        'mime' => $file->getClientMimeType(),
                        'size' => $file->getSize(),
                    ]);
                    
                    Log::info('Attachment created with ID: ' . $attachment->id);
                }
    
            } else {
                Log::info('No files to upload');
            }
    
            // Add initial timeline entry
            $crf->addTimelineEntry(
                status: 'First Created',
                actionType: 'status_change',
                userId: Auth::id()
            );
    
            // Notify HOD
            $hods = $this->getHOD($crf->department_id);
            foreach ($hods as $hod) {
                if($hod) {
                    $hod->notify(new CrfCreated($crf));
                    Mail::to($hod->email)->queue(new CrfCreatedMail($crf));
                }
            }

    
            Log::info('=== CRF Store Method Completed Successfully ===');
            Log::info('CRF created successfully with number: ' . $crf->crf_number);

            return redirect()->route('dashboard')->with('success', 'CRF submitted successfully!');

        } catch (\Exception $e) {
            Log::error('CRF creation failed: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return redirect()->back()
                ->withInput()
                ->with('error', 'Failed to create CRF: ' . $e->getMessage());
        }

    }

    public function destroy(Crf $crf)
    {
        // Delete the supporting file if it exists
        if ($crf->supporting_file) {
            Storage::disk('public')->delete($crf->supporting_file);
        }
        
        $crf->delete();

        return redirect()->route('dashboard')->with('success', 'CRF deleted successfully!');
    }

    public function approve(Crf $crf)
    {
        $user = Auth::user();

        // Get IT Department ID
        $itDepartmentId = Department::where('dname', 'LIKE', '%Unit Teknologi Maklumat%')
            ->first()?->id;

        // Check if this is Hardware Relocation category
        $isHardwareRelocation = $crf->category->cname === 'Hardware Request/Relocation';

        // CASE 1: IT HOU approving CRFs (status 10 or 11 or 16 → 2)
        if ($user->department_id == $itDepartmentId && in_array($crf->application_status_id, [10, 11, 16])) {
            
            $crf->update([
                'application_status_id' => 2, // Approved by HOU IT
                'it_hou_approved_by' => $user->id,
                'it_hou_approved_at' => now(),
            ]);

            $crf->addTimelineEntry(
                status: 'Approved by HOU IT',
                actionType: 'status_change',
                remark: 'Approved by IT HOU: ' . $user->name,
                userId: $user->id
            );

            // Load relationships before sending mail
            $crf->load('department', 'category', 'approver');

            // Notify IT ASSIGN
            $itAssigns = $this->getITAssign();
            foreach ($itAssigns as $itAssign) {
                $itAssign->notify(new CrfApproved($crf));
                Mail::to($itAssign->email)->queue(new CrfApprovedByHouItMail($crf));
            }

            return redirect()->back()->with('success', 'CRF approved by IT HOU. Ready for assignment.');
        }

         // CASE 2: Department HOU approving their department's CRF (status 1 → 10)
        if ($crf->department_id !== $user->department_id) {
            abort(403, 'You can only approve CRFs from your department');
        }

        if ($crf->application_status_id != 1) {
            return redirect()->back()->with('error', 'CRF has already been processed');
        }

        // Both types go to status 10 (Approved by HOU)
        $crf->update([
            'application_status_id' => 10, // Approved by HOU
            'approved_by' => $user->id,
            'approved_by_hou_at' => now(),
        ]);

        if ($isHardwareRelocation) {

            $crf->addTimelineEntry(
                status: 'Approved by HOU',
                actionType: 'status_change',
                remark: 'Approved by HOU: ' . $user->name . ' (Awaiting TP approval)',
                userId: $user->id
            );

            // Load relationships before sending mail
            $crf->load('department', 'category', 'approver');

            // Notify Timbalan Pengarah
            $tpUsers = $this->getTPs();
            foreach ($tpUsers as $tp) {
                $tp->notify(new CrfApprovedByHOU($crf));
                Mail::to($tp->email)->queue(new CrfApprovedByHouMail($crf));
            }

            return redirect()->back()->with('success', 'CRF approved. Notification sent to Timbalan Pengarah for approval.');
        
        } else {

            $crf->addTimelineEntry(
                status: 'Approved by HOU',
                actionType: 'status_change',
                remark: 'Approved by HOU: ' . $user->name . ' (Awaiting IT HOU approval)',
                userId: $user->id
            );

            // Load relationships before sending mail
            $crf->load('department', 'category', 'approver');

            // Notify IT HOU
            $itHOUs = $this->getITHOUs();
            foreach ($itHOUs as $itHOU) {
                $itHOU->notify(new CrfApprovedByHOU($crf));
                Mail::to($itHOU->email)->queue(new CrfApprovedByHouMail($crf));
            }

            return redirect()->back()->with('success', 'CRF approved. Notification sent to IT HOU for approval.');
        }
    }

    public function reject(Request $request, $id){
        
        $request->validate([
            'rejection_reason' => 'required|string|max:500',
        ]);

        $crf = Crf::findOrFail($id);
        $user = Auth::user();
        $userRoles = $user->roles->pluck('name')->toArray();

        $rejectionStatus = null;
        $canReject = false;
        $rejectorTitle = '';

        if(in_array('HOU', $userRoles) && ($crf->application_status_id === 1 || $crf->application_status_id === 16)){
            $rejectionStatus = 13;
            $canReject = true;
            $rejectorTitle = 'Head Of Unit';

            $crf->addTimelineEntry(
                status: 'Rejected by HOU',
                actionType: 'status_change',
                remark: 'Rejected by: ' . $user->name,
                userId: $user->id
            );

        } elseif (in_array('TIMBALAN PENGARAH', $userRoles) && $crf->application_status_id === 10 && $crf->category_id === 5){
            $rejectionStatus = 14;
            $canReject = true;
            $rejectorTitle = 'Timbalan Pengarah';

            $crf->addTimelineEntry(
                status: 'Rejected by TP',
                actionType: 'status_change',
                remark: 'Rejected by: ' . $user->name,
                userId: $user->id
            );

        } elseif (in_array('HOU', $userRoles) && 

                // for HOU IT TO REJECT
                $user->department_id == Department::where('dname', 'LIKE', '%Unit Teknologi Maklumat%')->first()?->id &&
                in_array($crf->application_status_id, [10, 11])) {

            $rejectionStatus = 15;
            $canReject = true;
            $rejectorTitle = 'Head Of Unit IT';

            $crf->addTimelineEntry(
                status: 'Rejected by HOU IT',
                actionType: 'status_change',
                remark: 'Rejected by: ' . $user->name,
                userId: $user->id
            );
        }
        
        if (!$canReject || !$rejectionStatus) {
            return back()->withErrors(['error' => 'You are not authorized to reject this CRF at its current stage.']);
        }

        // update crf
        $crf->update([
            'application_status_id' => $rejectionStatus,
            'rejection_reason' => $request->rejection_reason,
            'rejected_by' => $user->id,
            'rejected_at' => now(),
        ]);

        $requesterEmail = $crf->user->email ?? $crf->email;
        Mail::to($requesterEmail)->queue(new CrfRejectedMail($crf, $request->rejection_reason));

        $requester = User::find($crf->user_id);

        if ($requester) {
            $requester->notify(new CrfRejected(
                $crf,
                $request->rejection_reason,
                $user->name . ' (' . $rejectorTitle . ')'
        ));
    }

        return redirect()->back()->with('success', 'CRF has been rejected successfully.');

    }

    public function redirectToITD(Request $request, $id)
    {
        $request->validate([
            'redirect_reason' => 'required|string|max:500',
        ]);

        $crf = Crf::findOrFail($id);
        $user = Auth::user();
        $userRoles = $user->roles->pluck('name')->toArray();

        // Only Vendor Admin can redirect from status 12 (Assigned to Vendor Admin)
        if (!in_array('VENDOR ADMIN', $userRoles) || $crf->application_status_id !== 12) {
            return back()->withErrors(['error' => 'You cannot redirect this CRF at its current stage.']);
        }

        // Update CRF - redirect back to IT HOU for reassessment
        $crf->update([
            'application_status_id' => 16, // Redirect to ITD
            'redirect_reason' => $request->redirect_reason,
            'redirected_by' => $user->id,
            'redirected_at' => now(),
            'assigned_vendor_admin_id' => null, // Clear vendor admin assignment
        ]);

        $crf->addTimelineEntry(
                status: 'Redirect to ITD',
                actionType: 'status_change',
                remark: 'Redirected by: ' . $user->name,
                userId: $user->id
            );

        // Get IT HOU users to notify them
        $itDepartment = Department::where('dname', 'LIKE', '%Unit Teknologi Maklumat%')->first();
        
        if ($itDepartment) {
            $itHOUs = User::role('HOU')
                ->where('department_id', $itDepartment->id)
                ->get();

            // Notify all IT HOUs
            foreach ($itHOUs as $itHOU) {
                $itHOU->notify(new CrfRedirectedNotification(
                    $crf,
                    $request->redirect_reason,
                    $user->name . ' (Vendor Admin)'
                ));
                Mail::to($itHOU->email)->queue(new CrfRedirectedToHouItMail($crf, $request->redirect_reason));
            }
        }

        return back()->with('success', 'CRF has been redirected to IT Department for reassessment.');
    }

    public function acknowledge(Crf $crf)
    {
        // Check if CRF is in "Verified" status (id: 2)
        if (!in_array($crf->application_status_id, [2, 11])) {
            return redirect()->route('dashboard')->with('error', 'CRF must be verified before acknowledgment');
        }
        
        // Update to "ITD Acknowledged" (id: 3)
        $crf->update([
            'application_status_id' => 3,
        ]);

        // Add timeline entry
        $crf->addTimelineEntry(
            status: 'ITD Acknowledged',
            actionType: 'status_change',
            userId: Auth::id()
        );
        
        return redirect()->route('dashboard')->with('success', 'CRF acknowledged successfully!');
    }

    public function assignToItd(Request $request, Crf $crf)
    {
        $validated = $request->validate([
            'assigned_to' => 'required|exists:users,id',
        ]);

        // Check if CRF is in "ITD Acknowledged" status
        if ($crf->application_status_id != 3) {
            return redirect()->route('dashboard')->with('error', 'CRF must be acknowledged before assignment');
        }

        // Verify the user has ITD PIC role
        $user = User::find($validated['assigned_to']);
        if (!$user->hasRole('ITD PIC')) {
            return redirect()->route('dashboard')->with('error', 'Selected user is not an ITD PIC');
        }

        // Update to "Assigned to ITD" (id: 4)
        $crf->update([
            'application_status_id' => 4,
            'assigned_to' => $validated['assigned_to'],
        ]);

        // Add timeline entry
        $crf->addTimelineEntry(
            status: 'Assigned to ITD',
            actionType: 'status_change',
            remark: 'Assigned to ' . $user->name,
            userId: Auth::id()
        );

        // Notify assigned user
        $user->notify(new CrfAssigned($crf));
        Mail::to($user->email)->queue(new CrfAssignedToPicMail($crf, $user));

        return redirect()->route('dashboard')->with('success', 'CRF assigned to ITD successfully!');
    }

    public function assignToVendor(Request $request, Crf $crf)
    {
        $validated = $request->validate([
            'assigned_to' => 'required|exists:users,id',
        ]);

        // Check if CRF is in "ITD Acknowledged" status
        if ($crf->application_status_id != 3) {
            return redirect()->route('dashboard')->with('error', 'CRF must be acknowledged before assignment');
        }

        // Verify the user has Vendor PIC role
        $user = User::find($validated['assigned_to']);
        if (!$user->hasRole('VENDOR PIC')) {
            return redirect()->route('dashboard')->with('error', 'Selected user is not a Vendor PIC');
        }

        // Update to "Assigned to Vendor" (id: 5)
        $crf->update([
            'application_status_id' => 5,
            'assigned_to' => $validated['assigned_to'],
        ]);

        // Add timeline entry
        $crf->addTimelineEntry(
            status: 'Assigned to Vendor',
            actionType: 'status_change',
            remark: 'Assigned to ' . $user->name,
            userId: Auth::id()
        );

        // Notify assigned user
        $user->notify(new CrfAssigned($crf));
        Mail::to($user->email)->queue(new CrfAssignedToPicMail($crf, $user));

        return redirect()->route('dashboard')->with('success', 'CRF assigned to Vendor successfully!');
    }

    public function assignByITAssign(Request $request, Crf $crf)
    {
        $request->validate([
            'assign_type' => 'required|in:itd,vendor',
            'assigned_to' => 'required_if:assign_type,itd|exists:users,id',
            'vendor_admin_id' => 'required_if:assign_type,vendor|exists:users,id',
        ]);

        if ($request->assign_type === 'itd') {
            
            $user = User::find($request['assigned_to']);

            // Assign directly to ITD PIC
            $crf->update([
                'assigned_to' => $request->assigned_to,
                'application_status_id' => 4, // Assigned to ITD
            ]);

            
            // Add timeline entry
            $crf->addTimelineEntry(
                status: 'Assigned to ITD',
                actionType: 'status_change',
                remark: 'Assigned to ' . $user->name,
                userId: Auth::id()
            );
            
            $user->notify(new CrfAssigned($crf));
            Mail::to($user->email)->queue(new CrfAssignedToPicMail($crf, $user));

            return redirect()->back()->with('message', 'CRF assigned to ITD PIC successfully!');

        } else {

            $user = User::find($request['vendor_admin_id']);

            // Assign to Vendor Admin first
            $crf->update([
                'assigned_vendor_admin_id' => $request->vendor_admin_id,
                'application_status_id' => 12, // Assigned to Vendor Admin (new status ID)
            ]);

            $crf->addTimelineEntry(
                status: 'Assigned to Vendor Admin',
                actionType: 'status_change',
                remark: 'Assigned to ' . $user->name,
                userId: Auth::id()
            );
            
            $user->notify(new CrfAssigned($crf));
            Mail::to($user->email)->queue(new CrfAssignedToVendorAdminMail($crf, $user));
            
            return redirect()->back()->with('message', 'CRF assigned to Vendor Admin successfully!');
        }
    }

    public function assignVendorPIC(Request $request, Crf $crf)
    {
        // Only vendor admin can do this
        Gate::authorize('Assign Vendor PIC');
        
        $request->validate([
            'assigned_to' => 'required|exists:users,id',
        ]);

        $user = User::find($request['assigned_to']);

        $crf->update([
            'assigned_to' => $request->assigned_to,
            'application_status_id' => 5, // Assigned to Vendor
        ]);

        
        $crf->addTimelineEntry(
            status: 'Assigned to Vendor',
            actionType: 'status_change',
            remark: 'Assigned to ' . $user->name,
            userId: Auth::id()
        );
        
        $user->notify(new CrfAssignedToVendorPICNotification ($crf));
        Mail::to($user->email)->queue(new CrfAssignedToPicMail($crf, $user));
        
        return redirect()->back()->with('message', 'CRF assigned to Vendor PIC successfully!');
    }

    public function reassignToItd(Request $request, Crf $crf)
    {
        $validated = $request->validate([
            'assigned_to' => 'required|exists:users,id',
        ]);

        // Check if CRF is currently assigned to ITD (status 4 or 6 or 8)
        if (!in_array($crf->application_status_id, [4, 6, 8])) {
            return redirect()->back()->with('error', 'Can only reassign ITD CRFs');
        }

        // Verify the user has ITD PIC role
        $newUser = User::find($validated['assigned_to']);
        if (!$newUser->hasRole('ITD PIC')) {
            return redirect()->back()->with('error', 'Selected user is not an ITD PIC');
        }

        $oldUser = $crf->assigned_user;

        // Update to "Reassigned to ITD" (id: 6)
        $crf->update([
            'application_status_id' => 6,
            'assigned_to' => $validated['assigned_to'],
        ]);

        // Add timeline entry
        $crf->addTimelineEntry(
            status: 'Reassigned to ITD',
            actionType: 'status_change',
            remark: 'Reassigned from ' . ($oldUser ? $oldUser->name : 'N/A') . ' to ' . $newUser->name,
            userId: Auth::id()
        );

        // Notify new assigned user
        $newUser->notify(new CrfAssigned($crf));
        Mail::to($newUser->email)->queue(new CrfReassignedMail($crf, $newUser));

        return redirect()->back()->with('success', 'CRF reassigned to ITD successfully!');
    }

    public function reassignToVendor(Request $request, Crf $crf)
    {
        $validated = $request->validate([
            'assigned_to' => 'required|exists:users,id',
        ]);

        // Check if CRF is currently assigned to Vendor (status 5 or 7 or 8)
        if (!in_array($crf->application_status_id, [5, 7, 8, 12])) {
            return redirect()->back()->with('error', 'Can only reassign Vendor CRFs');
        }

        // Verify the user has Vendor PIC role
        $newUser = User::find($validated['assigned_to']);
        if (!$newUser->hasRole('VENDOR PIC')) {
            return redirect()->back()->with('error', 'Selected user is not a Vendor PIC');
        }

        $oldUser = $crf->assigned_user;

        // Update to "Reassigned to Vendor" (id: 7)
        $crf->update([
            'application_status_id' => 7,
            'assigned_to' => $validated['assigned_to'],
        ]);

        // Add timeline entry
        $crf->addTimelineEntry(
            status: 'Reassigned to Vendor',
            actionType: 'status_change',
            remark: 'Reassigned from ' . ($oldUser ? $oldUser->name : 'N/A') . ' to ' . $newUser->name,
            userId: Auth::id()
        );

        // Notify new assigned user
        $newUser->notify(new CrfAssigned($crf));
        Mail::to($newUser->email)->queue(new CrfReassignedMail($crf, $newUser));

        return redirect()->back()->with('success', 'CRF reassigned to Vendor successfully!');
    }

    public function show(Crf $crf)
    {

        $user = Auth::user();

        $itDepartmentId = Department::where('dname', 'LIKE', '%Unit Teknologi Maklumat%')
            ->first()?->id;

        $crf->load([
            'department',
            'category',
            'factor',
            'application_status',
            'approver',
            'tp_approver',
            'it_hou_approver',
            'assigned_user',
            'statusTimeline.user',
            'attachments',
        ]);

        // Format timeline for frontend
        $statusTimeline = $crf->statusTimeline->map(function ($timeline) {
            return [
                'id' => $timeline->id,
                'status' => $timeline->status,
                'action_by' => $timeline->user ? $timeline->user->name : 'System',
                'remark' => $timeline->remark,
                'created_at' => $timeline->created_at,
            ];
        });

        // Transform attachments to match frontend type
        $attachments = $crf->attachments->map(function ($attachment) {
            return [
                'id' => $attachment->id,
                'name' => $attachment->filename,  // Map 'filename' to 'name'
                'url' => 'http://' . request()->getHost() . '/storage/' . $attachment->path,
                'mime' => $attachment->mime,
                'size' => $attachment->size,  // In bytes (frontend will convert to MB)
            ];
        });
        
        // Get ITD and Vendor PICs for reassignment
        $itdPics = User::role('ITD PIC')->select('id', 'name')->get();
        $vendorPics = User::role('VENDOR PIC')->select('id', 'name')->get();
        $vendorAdmins = User::role('VENDOR ADMIN')->select('id','name')->get();

        // Get all factors for dropdown
        $factors = Factor::all(['id', 'name']);
        
        return Inertia::render('crfs/show', [
            'crf' => array_merge($crf->toArray(), [
                'status_timeline' => $statusTimeline,
                'attachments' => $attachments,
            ]),
            'can_approve' => Gate::allows('verified CRF'),
            'can_approve_tp' => Gate::allows('approved by TP'),
            'can_acknowledge' => Gate::allows('Acknowledge CRF by ITD'),
            'can_assign_itd' => Gate::allows('Assign CRF To ITD'),
            'can_assign_vendor' =>Gate::allows('Assign CRF to Vendor'),
            'can_update' => Gate::allows('Update CRF (own CRF)') && $crf->assigned_to === Auth::id(),
            'can_assign_by_it' => Gate::allows('Assign CRF To ITD') && Gate::allows('Assign CRF to Vendor'),
            'can_assign_vendor_pic' => Gate::allows('Assign Vendor PIC'),
            'can_reassign_itd' => Gate::allows('Re Assign PIC ITD'),
            'can_reassign_vendor' => Gate::allows('Re Assign PIC Vendor'),
            'vendor_admins' => $vendorAdmins,
            'itd_pics' => $itdPics,
            'vendor_pics' => $vendorPics,
            'factors' => $factors,
            'is_it_hou' => $user->department_id == $itDepartmentId && Gate::allows('verified CRF'),
        ]);
    }

    public function update(Request $request, Crf $crf)
    {
        // Check if user is assigned to this CRF
        if ($crf->assigned_to !== Auth::id()) {
            abort(403, 'You can only update CRFs assigned to you');
        }

        $validated = $request->validate([
            'it_remark' => 'nullable|string',
        ]);

        // Check if remark was changed
        $remarkChanged = $crf->it_remark !== $validated['it_remark'];

        $crf->update($validated);

        if ($remarkChanged && !empty($validated['it_remark'])) {
            // Add remark to remarks table for history
            $crf->remarks()->create([
                'user_id' => Auth::id(),
                'remark' => $validated['it_remark'],
                'status' => $crf->application_status->status,
            ]);

            // Add timeline entry
            $actionType = $crf->it_remark ? 'remark_updated' : 'remark_added';
            $crf->addTimelineEntry(
                status: $crf->application_status->status,
                actionType: $actionType,
                remark: $validated['it_remark'],
                userId: Auth::id()
            );
        }

        return redirect()->back()->with('success', 'Remark updated successfully');
    }

    public function updateFactor(Request $request, Crf $crf)
    {

        //check if user is PIC assigned to
        if ($crf->assigned_to !== Auth::id()){
            abort(403, 'Only assigned PIC can update factor');
        }

        $validated = $request->validate([
            'factor_id' => 'required|exists:factors,id',
        ]);

        $factor = Factor::find($validated['factor_id']);

        $crf->update([
            'factor_id' => $validated['factor_id'],
        ]);
        
        $crf->addTimelineEntry(
            status: $crf->application_status->status,
            actionType: 'factor_updated',
            remark: 'Factor set to: ' . $factor->name,
            userId: Auth::id()
        );

        return redirect()->back()->with('success', 'Factor updated successfully');
    }

    public function markInProgress(Crf $crf)
    {
        if ($crf->assigned_to !== Auth::id()) {
            abort(403);
        }

        $crf->load('user');
        $crf->update(['application_status_id' => 8]); // Work in progress

        $requesterEmail = $crf->user?->email;
        if ($requesterEmail) {
            Mail::to($requesterEmail)->queue(new CrfStatusUpdatedMail($crf, 'Work in Progress'));
        }

        // Add timeline entry
        $crf->addTimelineEntry(
            status: 'Work in progress',
            actionType: 'status_change',
            userId: Auth::id()
        );

        return redirect()->back()->with('success', 'CRF marked as in progress');
    }

    public function markCompleted(Crf $crf)
    {
        if ($crf->assigned_to !== Auth::id()) {
            abort(403);
        }

        $crf->load('user');
        $crf->update(['application_status_id' => 9]); // Closed

        $requesterEmail = $crf->user?->email;
        if ($requesterEmail) {
            Mail::to($requesterEmail)->queue(new CrfStatusUpdatedMail($crf, 'Closed'));
        }

        // Add timeline entry
        $crf->addTimelineEntry(
            status: 'Closed',
            actionType: 'status_change',
            userId: Auth::id()
        );

        return redirect()->back()->with('success', 'CRF marked as closed');
    }

    public function checkStatus(Request $request)
    {
        $searchResults = null;
        $searchValue = null;

        if ($request->has('search')) {
            $searchValue = $request->input('search');
            
            // Search across multiple fields
            $searchResults = Crf::with(['department', 'category', 'application_status', 'assigned_user', 'approver'])
                ->where(function($query) use ($searchValue) {
                    // Remove # if present for ID search
                    $cleanId = str_starts_with($searchValue, '#') ? substr($searchValue, 1) : $searchValue;
                    
                    // Search by CRF ID
                    // if (is_numeric($cleanId)) {
                    //     $query->orWhere('id', $cleanId);
                    // }

                    $query->orWhere('crf_number', $cleanId);
                    
                    // Search by name (case insensitive)
                    $query->orWhere('fname', 'LIKE', '%' . $searchValue . '%');
                    
                    // Search by NRIC
                    $query->orWhere('nric', 'LIKE', '%' . $searchValue . '%');
                })
                ->orderBy('created_at', 'desc')
                ->get();
        }

        return Inertia::render('crfs/check-status', [
            'searchResults' => $searchResults,
            'searchValue' => $searchValue,
        ]);
    }

    // Helper method to get HOD
    private function getHOD($departmentId)
    {
        // Get HOD by role and department
        return User::role('HOU')
            ->where('department_id', $departmentId)
            ->get();
    }

    // Helper method to get ITD Admins
    private function getITDAdmins()
    {
        // Get all users with ITD Admin role
        return User::role('ITD Admin')->get();
    }

    private function getITAssign(){
        
        // get it assign user
        return User::role('IT ASSIGN')->get();
    }

    // app/Http/Controllers/CrfController.php

    public function approveByTP(Crf $crf)
    {
        $user = Auth::user();

        // Check if CRF is in "Verified by HOU" status
        if ($crf->application_status_id != 10) {
            return redirect()->route('dashboard')->with('error', 'This CRF is not ready for TP approval');
        }

        // Update to "Verified by TP"
        $crf->update([
            'application_status_id' => 11, // Approved by TP
            'tp_approved_by' => $user->id,
            'approved_by_tp_at' => now(),
        ]);

        // Add timeline entry
        $crf->addTimelineEntry(
            status: 'Approved by TP',
            actionType: 'status_change',
            remark: 'Approved by Timbalan Pengarah: ' . $user->name,
            userId: $user->id
        );

        // Load relationships before sending mail
        $crf->load('department', 'category', 'tp_approver');

        // Notify IT HOU
        $itHOUs = $this->getITHOUs();
        foreach ($itHOUs as $itHOU) {
            $itHOU->notify(new CrfApprovedByHOU($crf));
            Mail::to($itHOU->email)->queue(new CrfApprovedByTpMail($crf));
        }

        return redirect()->route('dashboard')->with('success', 'CRF approved successfully! Notification sent to ITD Admin.');
    }

    // Helper method to get TP users
    private function getTPs()
    {
        return User::role('Timbalan Pengarah')->get();
    }

    private function getITHOUs()
    {
        $itDepartmentId = Department::where('dname', 'LIKE', '%Unit Teknologi Maklumat%')
        ->first()?->id;

        return User::role('HOU')
            ->where('department_id', $itDepartmentId)
            ->get();
    }
}