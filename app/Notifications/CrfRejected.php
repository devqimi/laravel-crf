<?php

namespace App\Notifications;

use App\Models\Crf;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
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
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('CRF Request Rejected - ' . $this->crf->crf_number)
            ->greeting('Hello ' . $notifiable->name . ',')
            ->error()
            ->line('Your CRF request has been rejected.')
            ->line('**CRF Number:** ' . $this->crf->crf_number)
            ->line('**Category:** ' . ($this->crf->category->cname ?? 'N/A'))
            ->line('**Issue:** ' . $this->crf->issue)
            ->line('**Rejected By:** ' . $this->rejectedBy)
            ->line('**Rejection Reason:**')
            ->line($this->rejectionReason)
            ->action('View CRF Details', url('/crfs/' . $this->crf->id))
            ->line('You may submit a new request with the necessary corrections.')
            ->salutation('Regards, IT Department');
    }

    /**
     * Get the array representation of the notification (for database).
     */
    public function toArray($notifiable): array
    {
        return [
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