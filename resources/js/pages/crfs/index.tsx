import TablePagination from '@/components/table-pagination';
import CRFReportGenerator from '@/components/crf-report-generator';
import { Button } from '@/components/ui/button';
import ITAssignModal from '@/components/ITAssignModal';
import CRFSearchFilter from '@/components/crf-search-filter';
import VendorAdminAssignModal from '@/components/VendorAdminAssignModal';
import {Card, CardAction, CardContent, CardHeader, CardTitle,} from '@/components/ui/card';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { ApplicationStatus, Category, Crf } from '@/types/crf';
import { Head, Link, router } from '@inertiajs/react';
import { CheckCircle, ClipboardCheck, UserPlus, Eye, XCircle, ArrowLeftRight, ClipboardList } from 'lucide-react';
import AssignCrfModal from '@/pages/crfs/AssignCrfModal';
import RejectCrfModal from '@/components/RejectCrfModal';
import RedirectToITDModal from '@/components/RedirectToITDModal';
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AssignToVendorPICModal from '@/components/AssignToVendorPICModal';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Customer Request Form',
        href: '/crfs',
    },
];

type User = {
    id: number;
    name: string;
};

type Factor = {
    id: number;
    name: string;
};

type CrfData = {
    id: number;
    crf_number: string;
    fname: string;
    nric: string;
    designation: string;
    extno: string;
    issue: string;
    reason: string;
    department: { dname: string };
    category: { cname: string };
    factor?: { id: number; name: string } | null;
    application_status: { status: string };
    application_status_id: number;
    assigned_to: number | null;
    assigned_user?: { name: string } | null;
    approver?: { name: string } | null;
    created_at: string;
    updated_at: string;
};

type Props = {
    crfs: Crf;
    department_crfs: CrfData[] | null;
    departments: { id: number; dname: string }[];
    can_view?: boolean;
    can_view_department?: boolean;
    can_delete?: boolean;
    can_create?: boolean;
    can_approve?: boolean;
    can_approve_tp?: boolean;
    can_acknowledge?: boolean;
    can_assign_itd?: boolean;
    can_assign_vendor?: boolean;
    can_update_own_crf?: boolean;
    can_assign_by_it?: boolean;
    can_assign_vendor_pic?: boolean;
    vendor_admins?: User[];
    hou_vendor?: User[];
    itd_pics?: User[];
    vendor_pics?: User[];
    factors: Factor[];
    categories: Category[];
    statuses: ApplicationStatus[];
    is_it_hou: boolean;
    is_admin_hou_pic?: boolean;
};

export default function Dashboard({
    crfs,
    department_crfs = null,
    departments,
    statuses,
    can_view = false,
    can_view_department = false,
    can_delete = false,
    can_create = false,
    can_approve = false,
    can_approve_tp = false,
    can_acknowledge = false,
    can_assign_itd = false,
    can_assign_vendor = false,
    can_update_own_crf = false,
    can_assign_by_it = false,
    can_assign_vendor_pic = false,
    vendor_admins = [],
    hou_vendor = [],
    itd_pics = [],
    vendor_pics = [],
    categories = [],
    factors = [],
    is_it_hou = false,
    is_admin_hou_pic = false,
}: Props) {

    const getStatusBadge = (status: string | undefined) => {
        if (!status) return null;

        const statusColors: Record<string, string> = {
            'First Created': 'bg-amber-100 text-amber-800',
            'Approved by HOU IT': 'bg-green-100 text-green-800',
            'ITD Acknowledged': 'bg-indigo-100 text-indigo-800',
            'Assigned to ITD': 'bg-blue-100 text-blue-800',
            'Assigned to Vendor': 'bg-cyan-100 text-cyan-800',
            'Reassigned to ITD': 'bg-blue-200 text-blue-900',
            'Reassigned to Vendor': 'bg-cyan-200 text-cyan-900',
            'Work in progress': 'bg-sky-100 text-sky-800',
            'Closed': 'bg-gray-200 text-gray-800',
            'Approved by HOU': 'bg-green-200 text-green-800',
            'Approved by TP': 'bg-green-200 text-green-800',
            'Assigned to Vendor Admin': 'bg-purple-100 text-purple-800',
            'Rejected by HOU': 'bg-red-100 text-red-800',
            'Rejected by TP': 'bg-red-100 text-red-800',
            'Rejected by HOU IT': 'bg-red-100 text-red-800',
            'Redirect to ITD': 'bg-yellow-100 text-yellow-800',
            'Assigned to HOU VENDOR': 'bg-indigo-100 text-indigo-800',
        };

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
                {status}
            </span>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Customer Request Form" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 bg-gray-100">
                <div className="mt-1 ml-1 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white shadow-lg rounded-lg p-4">
                    <h1 className="text-3xl font-bold mb-2">
                        <ClipboardList className="inline-block mr-2 size-8" />
                        Customer Request Forms
                    </h1>
                    <p>Manage Customer Request Forms (CRFs) here.</p>
                </div>
                <Card>
                    <CardHeader className="flex items-center justify-between">
                        {can_approve ? (
                            <CardTitle>CRF Pending</CardTitle>
                        ) : (
                            <CardTitle>Customer Request Forms</CardTitle>
                        )}
                        <CardAction>
                            
                            {!can_create && (
                                <CRFReportGenerator 
                                    categories={categories}
                                    factors={factors}
                                    vendors={vendor_pics}
                                    itds={itd_pics}
                                />
                            )}

                            {can_create && (
                                <Link href={'crfs/create'}>
                                    <Button 
                                        variant={'default'}
                                        className="bg-blue-700 hover:bg-blue-800 dark:text-white">
                                        Create CRF
                                    </Button>
                                </Link>
                            )}

                        </CardAction>
                    </CardHeader>
                    <hr />
                    <CardContent>

                        {is_admin_hou_pic && (
                            
                            <CRFSearchFilter 
                                departments={departments}
                                categories={categories}
                                factors={factors}
                                statuses={statuses}
                            />
                        )}

                        <div className="rounded-md border overflow-hidden">
                            <Table>
                                <TableHeader className="bg-blue-900">
                                    <TableRow>
                                        <TableHead className="font-bold text-white">
                                            CRF No.
                                        </TableHead>
                                        <TableHead className="font-bold text-white">
                                            Name
                                        </TableHead>
                                        <TableHead className="font-bold text-white">
                                            NRIC
                                        </TableHead>
                                        <TableHead className="font-bold text-white">
                                            Department
                                        </TableHead>
                                        <TableHead className="font-bold text-white">
                                            Designation
                                        </TableHead>
                                        <TableHead className="font-bold text-white">
                                            Ext No
                                        </TableHead>
                                        <TableHead className="font-bold text-white">
                                            Category
                                        </TableHead>
                                        <TableHead className="font-bold text-white">
                                            Factor
                                        </TableHead>
                                        <TableHead className="font-bold text-white">
                                            Issue
                                        </TableHead>
                                        <TableHead className="font-bold text-white">
                                            Reason
                                        </TableHead>
                                        <TableHead className="font-bold text-white">
                                            Status
                                        </TableHead>
                                        <TableHead className="font-bold text-white">
                                            Approved HOU
                                        </TableHead>
                                        <TableHead className="font-bold text-white">
                                            Assigned PIC
                                        </TableHead>
                                        <TableHead className="font-bold text-white">
                                            Created At
                                        </TableHead>
                                        <TableHead className="font-bold text-white">
                                            Updated At
                                        </TableHead>

                                        {(can_view || can_delete || can_approve || can_acknowledge || can_assign_itd || can_assign_vendor) && (
                                            <TableHead className="font-bold text-white">
                                                Actions
                                            </TableHead>
                                        )}
                                        
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {crfs.data.map((crf) => (
                                        <TableRow key={crf.id} className="bg-white dark:bg-gray-800">
                                            <TableCell>{crf.crf_number}</TableCell>
                                            <TableCell>{crf.fname}</TableCell>
                                            <TableCell>{crf.nric}</TableCell>
                                            <TableCell>{crf.department?.dname || 'N/A'}</TableCell>
                                            <TableCell>{crf.designation}</TableCell>
                                            <TableCell>{crf.extno}</TableCell>
                                            <TableCell>{crf.category?.cname || 'N/A'}</TableCell>
                                            <TableCell>{crf.factor ? crf.factor.name : 'N/A'}
                                            </TableCell>
                                            <TableCell className="max-w-xs">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <p className="truncate cursor-help">
                                                                {crf.issue}
                                                            </p>
                                                        </TooltipTrigger>
                                                        <TooltipContent className="max-w-sm">
                                                            <p className="text-sm whitespace-pre-wrap">{crf.issue}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </TableCell>
                                            <TableCell className="max-w-xs">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <p className="truncate cursor-help">
                                                                {crf.reason || '-'}
                                                            </p>
                                                        </TooltipTrigger>
                                                        <TooltipContent className="max-w-sm">
                                                            <p className="text-sm whitespace-pre-wrap">{crf.reason || '-'}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(crf.application_status?.status)}</TableCell>
                                            <TableCell>{crf.approver?.name || '-'}</TableCell>
                                            <TableCell>{crf.assigned_user?.name || '-'}</TableCell>
                                            <TableCell>{new Date(crf.created_at,).toLocaleString()}</TableCell>
                                            <TableCell>{new Date(crf.updated_at,).toLocaleString()}</TableCell>
                                            {(can_view || can_delete || can_approve || can_acknowledge || can_assign_itd || can_assign_vendor || can_update_own_crf || can_approve_tp) && (
                                                <TableCell>
                                                    <div className="flex gap-2">

                                                        {/* for pic to update crf progress*/}
                                                        {can_view && (
                                                            <Link href={`/crfs/${crf.id}`}>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    title="View CRF"
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                    View Details
                                                                </Button>
                                                            </Link>
                                                        )}
                                                        
                                                    </div>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        {crfs.data.length > 0 ? (
                            <TablePagination
                                total={crfs.total}
                                from={crfs.from}
                                to={crfs.to}
                                links={crfs.links}
                            />
                        ) : (
                            <div className="flex h-full justify-center">
                                No Crf Yet..
                            </div>
                        )}
                    </CardContent>

                </Card>
                
                {/* FOR HOU DASHBOARD CRF VIEW */}
                {(can_approve && can_view_department && department_crfs && department_crfs.length > 0) && (
                    <Card>
                        <CardHeader>
                            <CardTitle>All CRF</CardTitle>
                        </CardHeader>
                        <hr />
                        <CardContent>
                            <div className="rounded-md border overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-blue-900">
                                        <TableRow>
                                            <TableHead className="font-bold text-white">
                                                CRF No.
                                            </TableHead>
                                            <TableHead className="font-bold text-white">
                                                Name
                                            </TableHead>
                                            <TableHead className="font-bold text-white">
                                                NRIC
                                            </TableHead>
                                            <TableHead className="font-bold text-white">
                                                Department
                                            </TableHead>
                                            <TableHead className="font-bold text-white">
                                                Designation
                                            </TableHead>
                                            <TableHead className="font-bold text-white">
                                                Ext & HP No
                                            </TableHead>
                                            <TableHead className="font-bold text-white">
                                                Category
                                            </TableHead>
                                            <TableHead className="font-bold text-white">
                                                Factor
                                            </TableHead>
                                            <TableHead className="font-bold text-white">
                                                Issue
                                            </TableHead>
                                            <TableHead className="font-bold text-white">
                                                Reason
                                            </TableHead>
                                            <TableHead className="font-bold text-white">
                                                Status
                                            </TableHead>
                                            <TableHead className="font-bold text-white">
                                                Approved By
                                            </TableHead>
                                            <TableHead className="font-bold text-white">
                                                Created At
                                            </TableHead>
                                            <TableHead className="font-bold text-white">
                                                Updated At
                                            </TableHead>

                                            {(can_view || can_delete || can_approve || can_acknowledge || can_assign_itd || can_assign_vendor) && (
                                                <TableHead className="font-bold text-white">
                                                    Actions
                                                </TableHead>
                                            )}
                                            
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {department_crfs.map((crf) => (
                                            <TableRow key={crf.id} className="bg-white dark:bg-gray-800">
                                                <TableCell>{crf.crf_number}</TableCell>
                                                <TableCell>{crf.fname}</TableCell>
                                                <TableCell>{crf.nric}</TableCell>
                                                <TableCell>{crf.department?.dname || 'N/A'}</TableCell>
                                                <TableCell>{crf.designation}</TableCell>
                                                <TableCell>{crf.extno}</TableCell>
                                                <TableCell>{crf.category?.cname || 'N/A'}</TableCell>
                                                <TableCell>{crf.factor ? crf.factor.name : 'N/A'}
                                                </TableCell>
                                                <TableCell className="max-w-xs">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <p className="truncate cursor-help">
                                                                    {crf.issue}
                                                                </p>
                                                            </TooltipTrigger>
                                                            <TooltipContent className="max-w-sm">
                                                                <p className="text-sm whitespace-pre-wrap">{crf.issue}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </TableCell>
                                                <TableCell className="max-w-xs">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <p className="truncate cursor-help">
                                                                    {crf.reason || '-'}
                                                                </p>
                                                            </TooltipTrigger>
                                                            <TooltipContent className="max-w-sm">
                                                                <p className="text-sm whitespace-pre-wrap">{crf.reason || '-'}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </TableCell>
                                                <TableCell>{getStatusBadge(crf.application_status?.status)}</TableCell>
                                                <TableCell>{crf.approver?.name || '-'}</TableCell>
                                                <TableCell>{new Date(crf.created_at,).toLocaleString()}</TableCell>
                                                <TableCell>{new Date(crf.updated_at,).toLocaleString()}</TableCell>
                                                {(can_view || can_delete || can_approve || can_acknowledge || can_assign_itd || can_assign_vendor || can_update_own_crf) && (
                                                    <TableCell>
                                                        <div className="flex gap-2">

                                                            {/* view crf details */}
                                                            {can_view && (
                                                                <Link href={`/crfs/${crf.id}`}>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        title="View CRF"
                                                                    >
                                                                        <Eye className="h-4 w-4" />
                                                                        View Details
                                                                    </Button>
                                                                </Link>
                                                            )}
                                                            
                                                        </div>
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>

                        {department_crfs.length > 0 ? (
                            <TablePagination
                                total={crfs.total}
                                from={crfs.from}
                                to={crfs.to}
                                links={crfs.links}
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center">
                                No Results Found!
                            </div>
                        )}
                        
                    </Card>    
                )}
            </div>
        </AppLayout>
    );
}
