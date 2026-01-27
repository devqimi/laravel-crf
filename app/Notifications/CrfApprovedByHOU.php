<?php

namespace App\Notifications;

use App\Models\Crf;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class CrfApprovedByHOU extends Notification
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
            'title' => 'CRF Approved by HOU - Awaiting Your Approval',
            'message' => 'Hardware Request/Relocation CRF #' . $this->crf->crf_number . ' has been approved by HOU and requires your approval',
            'action_url' => '/crfs/' . $this->crf->id,
            'type' => 'crf_approved_by_hou',
        ];
    }
}