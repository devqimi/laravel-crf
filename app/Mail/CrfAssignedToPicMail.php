<?php

namespace App\Mail;

use App\Models\Crf;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CrfAssignedToPicMail extends Mailable
{
    use Queueable, SerializesModels;

    public $crf;
    public $assignedUser;

    public function __construct(Crf $crf, User $assignedUser)
    {
        $this->crf = $crf;
        $this->assignedUser = $assignedUser;
    }

    public function build()
    {
        return $this->subject('CRF Assigned to You: ' . $this->crf->crf_number)
                    ->view('emails.crf.assigned-to-pic');
    }
}