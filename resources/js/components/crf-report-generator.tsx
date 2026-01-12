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
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { FileDown, Loader2 } from 'lucide-react';

interface Category {
    id: number;
    cname: string;
}

interface Factor {
    id: number;
    name: string;
};

interface User {
    id: number;
    name: string;
}

interface ReportGeneratorProps {
    categories: Category[];
    factors: Factor[];
    vendors: User[];
    itds: User[];
}

export default function CRFReportGenerator({ categories, factors, vendors, itds }: ReportGeneratorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        actionByITD: 'all',
        actionByVendor: 'all',
        selectedCategories: [] as number[],
        selectedFactors: [] as number[],
        reportType: 'all',
    });

    const handleCategoryToggle = (categoryId: number) => {
        setFilters(prev => ({
            ...prev,
            selectedCategories: prev.selectedCategories.includes(categoryId)
                ? prev.selectedCategories.filter(id => id !== categoryId)
                : [...prev.selectedCategories, categoryId]
        }));
    };

    const handleSelectAllCategories = () => {
        if (filters.selectedCategories.length === categories.length) {
            setFilters(prev => ({ ...prev, selectedCategories: [] }));
        } else {
            setFilters(prev => ({ 
                ...prev, 
                selectedCategories: categories.map(c => c.id) 
            }));
        }
    };

    const handleFactorToggle = (factorId: number) => {
        setFilters(prev => ({
            ...prev,
            selectedFactors: prev.selectedFactors.includes(factorId)
                ? prev.selectedFactors.filter(id => id !== factorId)
                : [...prev.selectedFactors, factorId]
        }));
    };

    const handleSelectAllFactors = () => {
        if (filters.selectedFactors.length === factors.length) {
            setFilters(prev => ({ ...prev, selectedFactors: [] }));
        } else {
            setFilters(prev => ({ 
                ...prev, 
                selectedFactors: factors.map(f => f.id) 
            }));
        }
    };

    const handleGenerateReport = () => {
        setIsGenerating(true);
        
        const params = new URLSearchParams();
        if (filters.startDate) params.append('start_date', filters.startDate);
        if (filters.endDate) params.append('end_date', filters.endDate);

        if (filters.actionByITD && filters.actionByITD !== 'all' && filters.actionByITD !== 'none') {
            params.append('action_by_itd', filters.actionByITD);
        } else if (filters.actionByITD === 'none') {
            params.append('action_by_itd', 'none');
        }

        if (filters.actionByVendor && filters.actionByVendor !== 'all' && filters.actionByVendor !== 'none') {
            params.append('action_by_vendor', filters.actionByVendor);
        } else if (filters.actionByVendor === 'none') {
            params.append('action_by_vendor', 'none');
        }

        if (filters.selectedCategories.length > 0) {
            params.append('categories', filters.selectedCategories.join(','));
        }
        if (filters.selectedFactors.length > 0) {
            params.append('factors', filters.selectedFactors.join(','));
        }
        if (filters.reportType !== 'all') params.append('report_type', filters.reportType);

        window.location.href = `/reports/crf/export?${params.toString()}`;
        
        setTimeout(() => {
            setIsGenerating(false);
            setIsOpen(false);
        }, 1500);
    };

    const isFormValid = filters.startDate && filters.endDate;

    return (
        <>
            <Button
                onClick={() => setIsOpen(true)}
                variant="outline"
                className="bg-green-600 hover:bg-green-700 text-white border-green-600"
            >
                <FileDown className="h-4 w-4 mr-2" />
                Generate Report
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Generate CRF Report</DialogTitle>
                        <DialogDescription>
                            Select filters to generate the CRF report in Excel format.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* Date Range */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-900">Date Range *</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="startDate">Start Date</Label>
                                    <Input
                                        id="startDate"
                                        type="date"
                                        value={filters.startDate}
                                        onChange={(e) => setFilters(prev => ({ 
                                            ...prev, 
                                            startDate: e.target.value 
                                        }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="endDate">End Date</Label>
                                    <Input
                                        id="endDate"
                                        type="date"
                                        value={filters.endDate}
                                        onChange={(e) => setFilters(prev => ({ 
                                            ...prev, 
                                            endDate: e.target.value 
                                        }))}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Report Type */}
                        <div className="space-y-2">
                            <Label htmlFor="reportType">Report Type</Label>
                            <Select
                                value={filters.reportType}
                                onValueChange={(value) => setFilters(prev => ({ 
                                    ...prev, 
                                    reportType: value 
                                }))}
                            >
                                <SelectTrigger id="reportType">
                                    <SelectValue placeholder="Select report type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All CRF</SelectItem>
                                    <SelectItem value="pending">Pending Only</SelectItem>
                                    <SelectItem value="in_progress">In Progress Only</SelectItem>
                                    <SelectItem value="completed">Completed Only</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Action By (Vendor) */}
                        <div className="space-y-2">
                            <Label htmlFor="actionBy">Action By (Vendor)</Label>
                            <Select
                                value={filters.actionByVendor}
                                onValueChange={(value) => setFilters(prev => ({ 
                                    ...prev, 
                                    actionByVendor: value
                                }))}
                            >
                                <SelectTrigger id="actionByVendor">
                                    <SelectValue placeholder="Select vendor (optional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Vendors</SelectItem>
                                    <SelectItem value="none">None</SelectItem>
                                    {vendors.map((vendor) => (
                                        <SelectItem key={vendor.id} value={vendor.id.toString()}>
                                            {vendor.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Action By (ITD) */}
                        <div className="space-y-2">
                            <Label htmlFor="actionByITD">Action By (ITD)</Label>
                            <Select
                                value={filters.actionByITD}
                                onValueChange={(value) => setFilters(prev => ({
                                    ...prev,
                                    actionByITD: value
                                }))}
                            >
                                <SelectTrigger id="actionByITD">
                                    <SelectValue placeholder="Select ITD (optional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All ITDs</SelectItem>
                                    <SelectItem value="none">None</SelectItem>
                                    {itds.map((itd) => (
                                        <SelectItem key={itd.id} value={itd.id.toString()}>
                                            {itd.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Categories */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Categories</Label>
                                <Button
                                    type="button"
                                    variant="link"
                                    size="sm"
                                    onClick={handleSelectAllCategories}
                                    className="h-auto p-0 text-xs"
                                >
                                    {filters.selectedCategories.length === categories.length 
                                        ? 'Deselect All' 
                                        : 'Select All'}
                                </Button>
                            </div>
                            <div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-3">
                                {categories.map((category) => (
                                    <div key={category.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`category-${category.id}`}
                                            checked={filters.selectedCategories.includes(category.id)}
                                            onCheckedChange={() => handleCategoryToggle(category.id)}
                                        />
                                        <label
                                            htmlFor={`category-${category.id}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                        >
                                            {category.cname}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-gray-500">
                                {filters.selectedCategories.length} of {categories.length} categories selected
                            </p>
                        </div>

                        {/* Factors */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Factors</Label>
                                <Button
                                    type="button"
                                    variant="link"
                                    size="sm"
                                    onClick={handleSelectAllFactors}
                                    className="h-auto p-0 text-xs"
                                >
                                    {filters.selectedFactors.length === factors.length 
                                        ? 'Deselect All'
                                        : 'Select All'}
                                </Button>
                            </div>
                            <div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-3">
                                {factors.map((factor) => (
                                    <div key={factor.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`factor-${factor.id}`}
                                            checked={filters.selectedFactors.includes(factor.id)}
                                            onCheckedChange={() => handleFactorToggle(factor.id)}
                                        />
                                        <label
                                            htmlFor={`factor-${factor.id}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                        >
                                            {factor.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-gray-500">
                                {filters.selectedFactors.length} of {factors.length} factors selected
                            </p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            disabled={isGenerating}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleGenerateReport}
                            disabled={!isFormValid || isGenerating}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <FileDown className="mr-2 h-4 w-4" />
                                    Generate Excel
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}