<?php

namespace App\Mail;

use App\Models\Crf;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CrfRedirectedToHouItMail extends Mailable
{
    use Queueable, SerializesModels;

    public $crf;
    public $redirectReason;

    public function __construct(Crf $crf, $redirectReason)
    {
        $this->crf = $crf;
        $this->redirectReason = $redirectReason;
    }

    public function build()
    {
        return $this->subject('CRF Redirected to IT: ' . $this->crf->crf_number)
                    ->view('emails.crf.redirected-to-hou-it');
    }
}