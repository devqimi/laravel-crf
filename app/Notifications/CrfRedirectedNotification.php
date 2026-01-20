<?php

namespace App\Notifications;

use App\Models\Crf;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
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
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('CRF Redirected to ITD - ' . $this->crf->crf_number)
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('A CRF has been redirected back to IT Department for reassessment.')
            ->line('**CRF Number:** ' . $this->crf->crf_number)
            ->line('**Category:** ' . ($this->crf->category->cname ?? 'N/A'))
            ->line('**Issue:** ' . $this->crf->issue)
            ->line('**Redirected By:** ' . $this->redirectedBy)
            ->line('**Redirect Reason:**')
            ->line($this->redirectReason)
            ->action('Review CRF', url('/crfs/' . $this->crf->id))
            ->line('Please review and decide whether to assign to ITD or reject the request.')
            ->salutation('Regards, CRF System');
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