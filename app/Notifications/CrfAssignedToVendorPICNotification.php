<?php

namespace App\Notifications;

use App\Models\Crf;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class CrfAssignedToVendorPICNotification extends Notification
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
            'message' => "CRF #{$this->crf->id} for {$this->crf->fname} has been assigned to you by Vendor Admin.",
            'crf_id' => $this->crf->id,
            'action_url' => url('/crfs/' . $this->crf->id),
            'type' => 'crf_assigned_vendor_pic',
            'created_at' => now()->toDateTimeString(),
        ];
    }
}