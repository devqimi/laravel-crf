import { FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    bgColor: string;
    iconColor: string;
    textColor: string;
    description?: string;
}

function StatCard({ title, value, icon, bgColor, iconColor, textColor, description }: StatCardProps) {
    return (
        <div className={`${bgColor} rounded-lg p-6 border border-gray-200 shadow-sm`}>
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className={`text-sm font-medium ${textColor} mb-1`}>{title}</p>
                    <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
                    {description && (
                        <p className={`text-xs ${textColor} opacity-70`}>{description}</p>
                    )}
                </div>
                <div className={`${iconColor} p-2 rounded-md bg-white bg-opacity-20`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}

interface CRFStatsProps {
    totalCRF: number;
    inProgress: number;
    completed: number;
    pending: number;
    acknowledged?: number;
    departmentData: DepartmentData[];
}

interface DepartmentData {
    department: string;
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
}

export default function CRFStats({ 
    totalCRF, 
    inProgress, 
    completed, 
    pending
}: CRFStatsProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-2 px-3">
                <h2 className="text-xl font-semibold text-gray-800">Customer Request Form (CRF) Overview</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-2">
                <StatCard
                    title="Pending"
                    value={pending}
                    icon={<AlertCircle className="w-5 h-5" />}
                    bgColor="bg-orange-50"
                    iconColor="text-orange-600"
                    textColor="text-gray-800"
                    description="Awaiting HOU approval"
                />
                <StatCard
                    title="In Progress"
                    value={inProgress}
                    icon={<Clock className="w-5 h-5" />}
                    bgColor="bg-blue-50"
                    iconColor="text-blue-600"
                    textColor="text-gray-800"
                    description="Being worked on"
                />
                <StatCard
                    title="Completed"
                    value={completed}
                    icon={<CheckCircle className="w-5 h-5" />}
                    bgColor="bg-green-50"
                    iconColor="text-green-600"
                    textColor="text-gray-800"
                    description="Successfully resolved"
                />
                <StatCard
                    title="Total CRF"
                    value={totalCRF}
                    icon={<FileText className="w-5 h-5" />}
                    bgColor="bg-purple-50"
                    iconColor="text-purple-600"
                    textColor="text-gray-800"
                    description="Submitted CRFs"
                />
            </div>
        </div>
    );
}