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
            'title' => 'New CRF Assigned to You',
            'message' => "CRF #{$this->crf->id} for {$this->crf->fname} has been assigned to you.",
            'crf_id' => $this->crf->id,
            'url' => url('/crfs/' . $this->crf->id),
            'type' => 'crf_assigned_itd',
            'created_at' => now()->toDateTimeString(),
        ];
    }
}