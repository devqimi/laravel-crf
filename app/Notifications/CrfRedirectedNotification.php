<?php

namespace App\Notifications;

use App\Models\Crf;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class CrfRedirectedNotification extends Notification
{
    use Queueable;

    protected $crf;
    protected $redirectReason;
    protected $redirectedBy;

    public function __construct(Crf $crf, $redirectReason, $redirectedBy)
    {
        $this->crf = $crf;
        $this->redirectReason = $redirectReason;
        $this->redirectedBy = $redirectedBy;
    }

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toArray($notifiable): array
    {
        return [
            'crf_id' => $this->crf->id,
            'crf_number' => $this->crf->crf_number,
            'redirect_reason' => $this->redirectReason,
            'action_url' => route('crfs.show', $this->crf->id),
            'redirected_by' => $this->redirectedBy,
            'message' => "CRF #{$this->crf->crf_number} has been redirected to ITD by {$this->redirectedBy}",
            'type' => 'redirect',
        ];
    }
}