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
import { ArrowLeftRight, Loader2 } from 'lucide-react';

interface RedirectToITDModalProps {
    crfId: number;
    isOpen: boolean;
    onClose: () => void;
}

export default function RedirectToITDModal({ crfId, isOpen, onClose }: RedirectToITDModalProps) {
    const [redirectReason, setRedirectReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleRedirect = () => {
        if (!redirectReason.trim()) {
            alert('Please provide a reason for redirecting this CRF');
            return;
        }

        if (!confirm('Are you sure you want to redirect this CRF back to IT Department?')) {
            return;
        }

        setIsSubmitting(true);

        router.post(
            `/crfs/${crfId}/redirect-to-itd`,
            { redirect_reason: redirectReason },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setRedirectReason('');
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
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-blue-600">
                        <ArrowLeftRight className="h-5 w-5" />
                        Redirect to IT Department
                    </DialogTitle>
                    <DialogDescription>
                        This request is not suitable for vendor handling. Please provide a reason for redirecting back to IT Department.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="redirect_reason">Redirect Reason *</Label>
                        <Textarea
                            id="redirect_reason"
                            value={redirectReason}
                            onChange={(e) => setRedirectReason(e.target.value)}
                            placeholder="Provide your reason for redirecting this CRF back to IT Department..."
                            rows={5}
                            maxLength={500}
                            className="resize-none"
                            disabled={isSubmitting}
                        />
                        <p className="text-xs text-gray-500">
                            {redirectReason.length}/500 characters
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
                        onClick={handleRedirect}
                        disabled={isSubmitting || !redirectReason.trim()}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Redirecting...
                            </>
                        ) : (
                            <>
                                <ArrowLeftRight className="mr-2 h-4 w-4" />
                                Redirect to ITD
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}