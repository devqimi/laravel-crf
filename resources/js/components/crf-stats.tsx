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
        <div className={`${bgColor} rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className={`text-sm font-medium ${textColor} opacity-90 mb-1`}>{title}</p>
                    <p className={`text-3xl font-semibold ${textColor}`}>{value}</p>
                    {description && (
                        <p className={`text-xs ${textColor} opacity-75`}>{description}</p>
                    )}
                </div>
                <div className={`${iconColor} p-3 rounded-lg bg-white bg-opacity-30`}>
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
                <h2 className="text-xl font-semibold">Customer Request Form (CRF) Overview</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-2">
                
                <StatCard
                    title="Pending"
                    value={pending}
                    icon={<AlertCircle className="w-6 h-6" />}
                    bgColor="bg-gradient-to-br from-orange-400 to-orange-500"
                    iconColor="text-orange-500"
                    textColor="text-white"
                    description="Awaiting HOU approval"
                />
                <StatCard
                    title="In Progress"
                    value={inProgress}
                    icon={<Clock className="w-6 h-6" />}
                    bgColor="bg-gradient-to-br from-blue-400 to-blue-500"
                    iconColor="text-blue-500"
                    textColor="text-white"
                    description="Being worked on"
                />
                <StatCard
                    title="Completed"
                    value={completed}
                    icon={<CheckCircle className="w-6 h-6" />}
                    bgColor="bg-gradient-to-br from-green-400 to-green-500"
                    iconColor="text-green-500"
                    textColor="text-white"
                    description="Successfully resolved"
                />
                <StatCard
                    title="Total CRF"
                    value={totalCRF}
                    icon={<FileText className="w-6 h-6" />}
                    bgColor="bg-gradient-to-br from-purple-400 to-purple-500"
                    iconColor="text-purple-500"
                    textColor="text-white"
                    description="Submitted CRFs"
                />
            </div>
        </div>
    );
}