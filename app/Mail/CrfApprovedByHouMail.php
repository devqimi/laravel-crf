<?php

namespace App\Mail;

use App\Models\Crf;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CrfApprovedByHouMail extends Mailable
{
    use Queueable, SerializesModels;

    public $crf;

    public function __construct(Crf $crf)
    {
        $this->crf = $crf;
    }

    public function build()
    {
        return $this->subject('CRF Approved by HOU: ' . $this->crf->crf_number)
                    ->view('emails.crf.approved-by-hou');
    }
}