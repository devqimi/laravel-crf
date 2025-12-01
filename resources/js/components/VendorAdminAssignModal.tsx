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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { router } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';

interface User {
    id: number;
    name: string;
}

interface VendorAdminAssignModalProps {
    crfId: number;
    isOpen: boolean;
    onClose: () => void;
    vendorPics: User[];
}

export default function VendorAdminAssignModal({
    crfId,
    isOpen,
    onClose,
    vendorPics,
}: VendorAdminAssignModalProps) {
    const [selectedPic, setSelectedPic] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = () => {
        if (!selectedPic) {
            alert('Please select a Vendor PIC');
            return;
        }

        setIsSubmitting(true);

        router.post(`/crfs/${crfId}/assign-vendor-pic`, 
            { assigned_to: selectedPic },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSubmitting(false);
                    handleClose();
                },
                onError: (errors) => {
                    setIsSubmitting(false);
                    console.error('Assignment error:', errors);
                    alert('Failed to assign Vendor PIC. Please try again.');
                },
            }
        );
    };

    const handleClose = () => {
        setSelectedPic('');
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Assign to Vendor PIC</DialogTitle>
                    <DialogDescription>
                        Select a Vendor PIC to handle this CRF
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="vendorPic">Select Vendor PIC</Label>
                        <Select
                            value={selectedPic}
                            onValueChange={setSelectedPic}
                        >
                            <SelectTrigger id="vendorPic">
                                <SelectValue placeholder="Choose a Vendor PIC" />
                            </SelectTrigger>
                            <SelectContent>
                                {vendorPics.length > 0 ? (
                                    vendorPics.map((pic) => (
                                        <SelectItem key={pic.id} value={pic.id.toString()}>
                                            {pic.name}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="no-pics" disabled>
                                        No Vendor PICs available
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <p className="text-xs text-gray-500">
                        The selected Vendor PIC will be responsible for handling this CRF
                    </p>
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!selectedPic || isSubmitting}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Assigning...
                            </>
                        ) : (
                            'Assign to PIC'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}