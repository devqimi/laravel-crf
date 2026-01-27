<?php

namespace App\Mail;

use App\Models\Crf;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CrfRejectedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $crf;
    public $rejectionReason;

    public function __construct(Crf $crf, $rejectionReason)
    {
        $this->crf = $crf;
        $this->rejectionReason = $rejectionReason;
    }

    public function build()
    {
        return $this->subject('CRF Rejected: ' . $this->crf->crf_number)
                    ->view('emails.crf.rejected');
    }
}