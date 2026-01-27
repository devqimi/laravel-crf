<?php

namespace App\Mail;

use App\Models\Crf;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CrfCreatedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $crf;

    public function __construct(Crf $crf)
    {
        $this->crf = $crf;
    }

    public function build()
    {        
        return $this->subject('New CRF Submitted: ' . $this->crf->crf_number)
                    ->view('emails.crf.created');
    }
}