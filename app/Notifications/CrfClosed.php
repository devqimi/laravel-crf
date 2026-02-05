<?php

namespace App\Notifications;

use App\Models\Crf;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class CrfClosed extends Notification
{
    use Queueable;

    protected $crf;
    protected $rejectionReason;
    protected $rejectedBy;

    public function __construct(Crf $crf)
    {
        $this->crf = $crf;
    }

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toArray($notifiable): array
    {
        return [
            'title' => 'CRF Closed',
            'crf_id' => $this->crf->id,
            'crf_number' => $this->crf->crf_number,
            'action_url' => route('crfs.show', $this->crf->id),
            'message' => "Your CRF #{$this->crf->crf_number} has been resolved.",
        ];
    }
}