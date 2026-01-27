<?php
// app/Notifications/CrfVerified.php

namespace App\Notifications;

use App\Models\Crf;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class CrfApproved extends Notification
{
    use Queueable;

    private $crf;

    public function __construct(Crf $crf)
    {
        $this->crf = $crf;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toArray($notifiable)
    {
        return [
            'crf_id' => $this->crf->id,
            'crf_number' => $this->crf->crf_number,
            'title' => 'CRF Approved by HOU',
            'message' => 'CRF #' . $this->crf->crf_number . ' has been approved by HOU and requires further action.',
            'action_url' => '/crfs/' . $this->crf->id,
            'type' => 'crf_approved',
        ];
    }
}