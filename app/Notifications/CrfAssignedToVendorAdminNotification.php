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
            'title' => 'CRF Assigned - Select Vendor PIC',
            'message' => "CRF #{$this->crf->id} for {$this->crf->fname} requires Vendor PIC assignment.",
            'crf_id' => $this->crf->id,
            'url' => url('/crfs/' . $this->crf->id),
            'type' => 'crf_assigned_vendor_admin',
            'created_at' => now()->toDateTimeString(),
        ];
    }
}