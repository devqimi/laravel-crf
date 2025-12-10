import QuickActions from '@/components/dashboard/QuickActions';
import PICQuickActions from '@/components/dashboard/PICQuickActions';
import RecentActivity from '@/components/dashboard/RecentActivity';
import MyCRFStats from '@/components/my-crf-stats';
import CRFStats from '@/components/crf-stats';
import CRFCharts from '@/components/crf-charts';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Category, Crf } from '@/types/crf';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
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

type Activity = {
    id: number;
    crf_id: number;
    message: string;
    type: 'created' | 'approved' | 'in_progress' | 'completed' | 'pending';
    created_at: string;
};

type CrfData = {
    id: number;
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

type TrendData = {
    date: string;
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
};

type DepartmentData = {
    department: string;
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
};

type Props = {
    crfs: Crf;
    stats: {
        // Admin stats
        total?: number;
        pending?: number;
        in_progress?: number;
        completed?: number;
        // User stats
        my_total?: number;
        my_pending?: number;
        my_in_progress?: number;
        my_completed?: number;
        my_this_month?: number;
    };
    chartData: {
        trendData: {
            daily: TrendData[];
            weekly: TrendData[];
            monthly: TrendData[];
        };
        departmentData: DepartmentData[];
    } | null;
    isAdminOrHOU?: boolean;
    isPIC?: boolean;
    department_crfs: CrfData[] | null;
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
    itd_pics?: User[];
    vendor_pics?: User[];
    factors: Factor[];
    categories: Category[];
    recent_activities?: Activity[];
    latest_crf?: any;
};

export default function Dashboard({
    stats,
    chartData,
    isAdminOrHOU,
    isPIC = false,
    recent_activities = [],
    // latest_crf = null,
}: Props) {

    // const [approvingId, setApprovingId] = useState<number | null>(null);
    // const [acknowledgingId, setAcknowledgingId] = useState<number | null>(null);
    // const [assignModalOpen, setAssignModalOpen] = useState(false);
    // const [selectedCrfId, setSelectedCrfId] = useState<number | null>(null);
    // const [itAssignModalOpen, setItAssignModalOpen] = useState(false);
    // const [vendorAdminModalOpen, setVendorAdminModalOpen] = useState(false);

    // const handleApprove = (crfId: number) => {
    //     if (confirm('Are you sure you want to approve this CRF?')) {
    //         setApprovingId(crfId);
    //         router.post(
    //             `/crfs/${crfId}/approve`,
    //             {},
    //             {
    //                 preserveScroll: true,
    //                 onSuccess: () => {
    //                     setApprovingId(null);
    //                 },
    //                 onError: () => {
    //                     setApprovingId(null);
    //                     alert('Failed to approve CRF');
    //                 },
    //             },
    //         );
    //     }
    // };

    // const handleAcknowledge = (crfId: number) => {
    //     if (confirm('Are you sure you want to acknowledge this CRF?')) {
    //         setAcknowledgingId(crfId);
    //         router.post(`/crfs/${crfId}/acknowledge`, {}, {
    //             preserveScroll: true,
    //             onSuccess: () => {
    //                 setAcknowledgingId(null);
    //             },
    //             onError: () => {
    //                 setAcknowledgingId(null);
    //                 alert('Failed to acknowledge CRF');
    //             },
    //         });
    //     }
    // };

    // const handleOpenAssignModal = (crfId: number) => {
    //     setSelectedCrfId(crfId);
    //     setAssignModalOpen(true);
    // };

    // const handleCloseAssignModal = () => {
    //     setAssignModalOpen(false);
    //     setSelectedCrfId(null);
    // };

    // // Handler for IT ASSIGN modal
    // const handleOpenITAssignModal = (crfId: number) => {
    //     setSelectedCrfId(crfId);
    //     setItAssignModalOpen(true);
    // };

    // // Handler for Vendor Admin modal
    // const handleOpenVendorAdminModal = (crfId: number) => {
    //     setSelectedCrfId(crfId);
    //     setVendorAdminModalOpen(true);
    // };

    // const getStatusBadge = (status: string | undefined) => {
    //     if (!status) return null;

    //     const statusColors: Record<string, string> = {
    //         'First Created': 'bg-amber-100 text-amber-800',
    //         'Approved': 'bg-green-100 text-green-800',
    //         'ITD Acknowledged': 'bg-indigo-100 text-indigo-800',
    //         'Assigned to ITD': 'bg-blue-100 text-blue-800',
    //         'Assigned to Vendor': 'bg-cyan-100 text-cyan-800',
    //         'Reassigned to ITD': 'bg-blue-200 text-blue-900',
    //         'Reassigned to Vendor': 'bg-cyan-200 text-cyan-900',
    //         'Work in progress': 'bg-sky-100 text-sky-800',
    //         'Closed': 'bg-gray-200 text-gray-800',
    //         'Approved by HOU': 'bg-green-200 text-green-800',
    //         'Approved by TP': 'bg-green-200 text-green-800',
    //         'Assigned to Vendor Admin': 'bg-purple-100 text-purple-800',
    //     };

    //     return (
    //         <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
    //             {status}
    //         </span>
    //     );
    // };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CRF" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">

                {isAdminOrHOU ? (
                    <>
                        {/* Admin/HOU View */}
                        <Card>
                            <CRFStats 
                                totalCRF={stats.total || 0}
                                inProgress={stats.in_progress || 0}
                                completed={stats.completed || 0}
                                pending={stats.pending || 0}
                            />
                        </Card>

                        {/* Charts for crfs by departments */}
                        {chartData && (
                            <CRFCharts 
                                trendData={chartData.trendData}
                                departmentData={chartData.departmentData}
                            />
                        )}
                    </>
                ) : isPIC ? (
                    <>
                        {/* PIC View */}
                        <Card>
                            <MyCRFStats 
                                myTotal={stats?.my_total || 0}
                                myPending={stats?.my_pending || 0}
                                myInProgress={stats?.my_in_progress || 0}
                                myCompleted={stats?.my_completed || 0}
                                myThisMonth={stats?.my_this_month || 0}
                            />
                        </Card>

                        {/* PIC Quick Actions */}
                        <PICQuickActions />

                        {/* PIC Recent Activity */}
                        <RecentActivity activities={recent_activities} />
                    </>
                ) : (
                    <>
                        {/* Regular User View */}
                        <Card>
                            <MyCRFStats 
                                myTotal={stats.my_total || 0}
                                myPending={stats.my_pending || 0}
                                myInProgress={stats.my_in_progress || 0}
                                myCompleted={stats.my_completed || 0}
                                myThisMonth={stats.my_this_month || 0}
                            />
                        </Card>

                        {/* Quick Actions */}
                        <QuickActions />

                        {/* Recent Activity */}
                        <RecentActivity activities={recent_activities} />
                    </>
                )}
            </div>
        </AppLayout>
    );
}
