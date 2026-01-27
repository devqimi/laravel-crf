<?php

namespace App\Mail;

use App\Models\Crf;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CrfApprovedByTpMail extends Mailable
{
    use Queueable, SerializesModels;

    public $crf;

    public function __construct(Crf $crf)
    {
        $this->crf = $crf;
    }

    public function build()
    {
        return $this->subject('CRF Approved by TP: ' . $this->crf->crf_number)
                    ->view('emails.crf.approved-by-tp');
    }
}