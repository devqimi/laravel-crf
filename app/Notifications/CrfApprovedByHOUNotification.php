<?php

namespace App\Notifications;

use App\Models\Crf;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class CrfApprovedByHOUNotification extends Notification
{
    use Queueable;

    protected $crf;

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
            'title' => 'CRF Approved - Pending Assignment',
            'message' => "CRF #{$this->crf->id} for {$this->crf->fname} has been approved and needs assignment.",
            'crf_id' => $this->crf->id,
            'url' => url('/crfs/' . $this->crf->id),
            'type' => 'crf_approved',
            'created_at' => now()->toDateTimeString(),
        ];
    }
}