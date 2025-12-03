<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Department;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
            'departments' => Department::all(),
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
    
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'nric' => ['required', 'string', 'max:12'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($request->user()->id)],
            'phone' => ['nullable', 'string', 'max:20'],
            'designation' => ['nullable', 'string', 'max:255'],
            'extno' => ['nullable', 'string', 'max:20'],
            'department_id' => ['required', 'exists:departments,id'],
        ]);

        // check if the department changed or not
        $departmentChanged = $user->department_id != $validated['department_id'];

        // update department
        $request->user()->update($validated);

        // if department is changed
        if($departmentChanged) {
            $newDepartment = Department::find($validated['department_id']);

            // if changed department is not IT
            if($newDepartment && $newDepartment->dname !== 'Unit Teknologi Maklumat'){
                
                //automatically assign USER role
                $user->syncRoles(['USER']);
            }
        }

        return back()->with('status', 'profile-updated');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
