<?php

namespace App\Notifications;

use App\Models\Crf;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class CrfAssignedToITDNotification extends Notification
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
            'crf_id' => $this->crf->id,
            'crf_number' => $this->crf->crf_number,
            'title' => 'New CRF Assigned to You',
            'message' => "CRF #{$this->crf->crf_number} for {$this->crf->fname} has been assigned to you.",
            'url' => url('/crfs/' . $this->crf->id),
            'type' => 'crf_assigned_itd',
            'created_at' => now()->toDateTimeString(),
        ];
    }
}