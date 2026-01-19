import QuickActions from '@/components/dashboard/QuickActions';
import PICQuickActions from '@/components/dashboard/PICQuickActions';
import RecentActivity from '@/components/dashboard/RecentActivity';
import MyCRFStats from '@/components/my-crf-stats';
import CRFStats from '@/components/crf-stats';
import CRFCharts from '@/components/crf-charts';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Category, Crf } from '@/types/crf';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import Auth from '@/actions/App/Http/Controllers/Auth';
import { usePage } from '@inertiajs/react';

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

    const { auth } = usePage<SharedData>().props;
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CRF" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="mt-1 ml-1">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
                    <p className="text-slate-600">Welcome back, {auth.user?.name}!</p>
                </div>

                {isAdminOrHOU ? (
                    <>
                        {/* Admin/HOU View */}
                        <Card className="bg-gradient-to-br from-blue-600 to-blue-700">
                            <CRFStats 
                                totalCRF={stats.total || 0}
                                inProgress={stats.in_progress || 0}
                                completed={stats.completed || 0}
                                pending={stats.pending || 0}
                                departmentData={chartData?.departmentData || []}
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
                        <Card className="bg-gradient-to-br from-blue-600 to-blue-700">
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
                        <Card className="bg-gradient-to-br from-blue-600 to-blue-700">
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
