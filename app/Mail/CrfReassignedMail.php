<?php

namespace App\Mail;

use App\Models\Crf;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CrfReassignedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $crf;
    public $newAssignedUser;

    public function __construct(Crf $crf, User $newAssignedUser)
    {
        $this->crf = $crf;
        $this->newAssignedUser = $newAssignedUser;
    }

    public function build()
    {
        return $this->subject('CRF Reassigned to You: ' . $this->crf->crf_number)
                    ->view('emails.crf.reassigned');
    }
}