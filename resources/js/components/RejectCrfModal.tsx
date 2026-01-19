import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@headlessui/react';
import { router } from '@inertiajs/react';
import { XCircle, Loader2 } from 'lucide-react';

interface RejectCrfModalProps {
    crfId: number;
    isOpen: boolean;
    onClose: () => void;
}

export default function RejectCrfModal({ crfId, isOpen, onClose }: RejectCrfModalProps) {
    const [rejectionReason, setRejectionReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleReject = () => {
        if (!rejectionReason.trim()) {
            alert('Please provide a rejection reason');
            return;
        }

        if (!confirm('Are you sure you want to reject this CRF? This action cannot be undone.')) {
            return;
        }

        setIsSubmitting(true);

        router.post(
            `/crfs/${crfId}/reject`,
            { rejection_reason: rejectionReason },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setRejectionReason('');
                    onClose();
                },
                onError: () => {
                    setIsSubmitting(false);
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
            }
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-lg sm:w-full">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                        <XCircle className="h-5 w-5" />
                        Reject CRF
                    </DialogTitle>
                    <DialogDescription>
                        Please provide a reason for rejecting this request. This will be visible to the requester.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="rejection_reason">Rejection Reason *</Label>
                        <Textarea
                            id="rejection_reason"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Enter detailed reason for rejection..."
                            rows={5}
                            maxLength={500}
                            className="resize-none"
                            disabled={isSubmitting}
                        />
                        <p className="text-xs text-gray-500">
                            {rejectionReason.length}/500 characters
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleReject}
                        disabled={isSubmitting || !rejectionReason.trim()}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Rejecting...
                            </>
                        ) : (
                            <>
                                <XCircle className="mr-2 h-4 w-4" />
                                Reject CRF
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}