<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Mail\WelcomeEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class EmailController extends Controller
{
    public function WelcomeEmail(){
        try {
            // Send test email
            Mail::to('haqimiimrann@gmail.com')->send(new WelcomeEmail());
            
            return response()->json([
                'success' => true,
                'message' => 'Email sent successfully to haqimiimrann@gmail.com'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send email',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // public function edit()
    // {
    //     return Inertia::render('settings/EmailPreferences', [
    //         'user' => auth()->user(),
    //     ]);
    // }

    // public function update(Request $request)
    // {
    //     $request->validate([
    //         'email_notifications_enabled' => 'required|boolean',
    //         'email_preferences' => 'nullable|array',
    //         'email_preferences.crf_created' => 'nullable|boolean',
    //         'email_preferences.crf_assigned' => 'nullable|boolean',
    //         'email_preferences.crf_approved' => 'nullable|boolean',
    //         'email_preferences.crf_rejected' => 'nullable|boolean',
    //         'email_preferences.crf_completed' => 'nullable|boolean',
    //     ]);

    //     auth()->user()->update([
    //         'email_notifications_enabled' => $request->email_notifications_enabled,
    //         'email_preferences' => $request->email_preferences,
    //     ]);

    //     return redirect()->back()->with('success', 'Email preferences updated successfully');
    // }
}