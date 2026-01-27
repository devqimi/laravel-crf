<?php

namespace App\Mail;

use App\Models\Crf;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CrfAssignedToVendorAdminMail extends Mailable
{
    use Queueable, SerializesModels;

    public $crf;
    public $vendorAdmin;

    public function __construct(Crf $crf, User $vendorAdmin)
    {
        $this->crf = $crf;
        $this->vendorAdmin = $vendorAdmin;
    }

    public function build()
    {
        return $this->subject('CRF Assigned to Vendor: ' . $this->crf->crf_number)
                    ->view('emails.crf.assigned-to-vendor-admin');
    }
}