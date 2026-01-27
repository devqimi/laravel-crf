<?php

namespace App\Mail;

use App\Models\Crf;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CrfStatusUpdatedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $crf;
    public $newStatus;

    public function __construct(Crf $crf, $newStatus)
    {
        $this->crf = $crf;
        $this->newStatus = $newStatus;
    }

    public function build()
    {
        return $this->subject('CRF Status Updated: ' . $this->crf->crf_number)
                    ->view('emails.crf.status-updated');
    }
}