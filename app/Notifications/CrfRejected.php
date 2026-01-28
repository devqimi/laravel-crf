<?php

namespace App\Notifications;

use App\Models\Crf;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class CrfRejected extends Notification
{
    use Queueable;

    protected $crf;
    protected $rejectionReason;
    protected $rejectedBy;

    public function __construct(Crf $crf, $rejectionReason, $rejectedBy)
    {
        $this->crf = $crf;
        $this->rejectionReason = $rejectionReason;
        $this->rejectedBy = $rejectedBy;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via($notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification (for database).
     */
    public function toArray($notifiable): array
    {
        return [
            'title' => 'Your CRF has been rejected',
            'crf_id' => $this->crf->id,
            'crf_number' => $this->crf->crf_number,
            'action_url' => route('crfs.show', $this->crf->id),
            'rejection_reason' => $this->rejectionReason,
            'rejected_by' => $this->rejectedBy,
            'message' => "Your CRF #{$this->crf->crf_number} has been rejected by {$this->rejectedBy}",
            'type' => 'rejection',
        ];
    }
}