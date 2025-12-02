<?php
// app/Notifications/CrfAssigned.php

namespace App\Notifications;

use App\Models\Crf;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class CrfAssigned extends Notification
{
    use Queueable;

    public function __construct(
        public Crf $crf
    ) {}

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toArray($notifiable): array
    {
        return [
            'crf_id' => $this->crf->id,
            'title' => 'New CRF Assigned to You',
            'message' => 'CRF #' . $this->crf->id . ' for '. $this->crf->fname . ' has been assigned to you',
            'crf_id' => $this->crf->id,
            'action_url' => '/crfs/' . $this->crf->id,
            'type' => 'crf_assigned',
            'created_at' => now()->toDateTimeString(),
        ];
    }
}