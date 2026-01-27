<?php

namespace App\Notifications;

use App\Models\Crf;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class CrfAssignedToVendorAdminNotification extends Notification
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
            'title' => 'CRF Assigned - Select Vendor PIC',
            'message' => "CRF #{$this->crf->crf_number} for {$this->crf->fname} requires Vendor PIC assignment.",
            'action_url' => '/crfs/' . $this->crf->id,
            'type' => 'crf_assigned_vendor_admin',
            'created_at' => now()->toDateTimeString(),
        ];
    }
}