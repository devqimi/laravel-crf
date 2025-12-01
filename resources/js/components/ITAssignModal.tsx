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

interface ITAssignModalProps {
    crfId: number;
    isOpen: boolean;
    onClose: () => void;
    itdPics: User[];
    vendorAdmins: User[];
}

export default function ITAssignModal({
    crfId,
    isOpen,
    onClose,
    itdPics,
    vendorAdmins,
}: ITAssignModalProps) {
    const [assignType, setAssignType] = useState<'itd' | 'vendor' | ''>('');
    const [selectedPerson, setSelectedPerson] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = () => {
        if (!assignType || !selectedPerson) {
            alert('Please select assignment type and person');
            return;
        }

        setIsSubmitting(true);

        const data = {
            assign_type: assignType,
            ...(assignType === 'itd' 
                ? { assigned_to: selectedPerson }
                : { vendor_admin_id: selectedPerson }
            ),
        };

        router.post(`/crfs/${crfId}/assign-by-it`, data, {
            preserveScroll: true,
            onSuccess: () => {
                setIsSubmitting(false);
                handleClose();
            },
            onError: (errors) => {
                setIsSubmitting(false);
                console.error('Assignment error:', errors);
                alert('Failed to assign CRF. Please try again.');
            },
        });
    };

    const handleClose = () => {
        setAssignType('');
        setSelectedPerson('');
        onClose();
    };

    const handleAssignTypeChange = (value: 'itd' | 'vendor') => {
        setAssignType(value);
        setSelectedPerson(''); // Reset selection when type changes
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Assign CRF</DialogTitle>
                    <DialogDescription>
                        Choose whether to assign this CRF to ITD or Vendor
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Assignment Type Selection */}
                    <div className="space-y-2">
                        <Label>Assignment Type</Label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="assignType"
                                    value="itd"
                                    checked={assignType === 'itd'}
                                    onChange={(e) => handleAssignTypeChange('itd')}
                                    className="h-4 w-4"
                                />
                                <span>Assign to ITD</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="assignType"
                                    value="vendor"
                                    checked={assignType === 'vendor'}
                                    onChange={(e) => handleAssignTypeChange('vendor')}
                                    className="h-4 w-4"
                                />
                                <span>Assign to Vendor</span>
                            </label>
                        </div>
                    </div>

                    {/* Person Selection */}
                    {assignType && (
                        <div className="space-y-2">
                            <Label htmlFor="person">
                                {assignType === 'itd' ? 'Select ITD PIC' : 'Select Vendor Admin'}
                            </Label>
                            <Select
                                value={selectedPerson}
                                onValueChange={setSelectedPerson}
                            >
                                <SelectTrigger id="person">
                                    <SelectValue placeholder={
                                        assignType === 'itd' 
                                            ? 'Choose ITD PIC' 
                                            : 'Choose Vendor Admin'
                                    } />
                                </SelectTrigger>
                                <SelectContent>
                                    {assignType === 'itd' ? (
                                        itdPics.length > 0 ? (
                                            itdPics.map((pic) => (
                                                <SelectItem key={pic.id} value={pic.id.toString()}>
                                                    {pic.name}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <SelectItem value="no-itd" disabled>
                                                No ITD PICs available
                                            </SelectItem>
                                        )
                                    ) : (
                                        vendorAdmins.length > 0 ? (
                                            vendorAdmins.map((admin) => (
                                                <SelectItem key={admin.id} value={admin.id.toString()}>
                                                    {admin.name}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <SelectItem value="no-vendor" disabled>
                                                No Vendor Admins available
                                            </SelectItem>
                                        )
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Helper Text */}
                    {assignType === 'vendor' && (
                        <p className="text-xs text-gray-500">
                            Note: The Vendor Admin will then assign this to a specific Vendor PIC
                        </p>
                    )}
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
                        disabled={!assignType || !selectedPerson || isSubmitting}
                        className="bg-purple-600 hover:bg-purple-700"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Assigning...
                            </>
                        ) : (
                            'Assign CRF'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}