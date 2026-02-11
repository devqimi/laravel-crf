import { FileText, Clock, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

interface MyStatCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    bgColor: string;
    iconColor: string;
    textColor: string;
    description?: string;
}

function MyStatCard({ title, value, icon, bgColor, iconColor, textColor, description }: MyStatCardProps) {
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

interface MyCRFStatsProps {
    myPending: number;
    myInProgress: number;
    myCompleted: number;
    myTotal: number;
    myThisMonth?: number;
}

export default function MyCRFStats({ 
    myPending, 
    myInProgress, 
    myCompleted, 
    myTotal,
    myThisMonth = 0
}: MyCRFStatsProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-2 px-3">
                <h2 className="text-xl font-semibold text-gray-800">My Customer Request Form (CRF) Overview</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-2">
                
                <MyStatCard
                    title="Pending"
                    value={myPending}
                    icon={<AlertCircle className="w-6 h-6" />}
                    bgColor="bg-orange-50"
                    iconColor="text-orange-600"
                    textColor="text-gray-800"
                    description="Awaiting HOU approval"
                />
                
                <MyStatCard
                    title="In Progress"
                    value={myInProgress}
                    icon={<Clock className="w-6 h-6" />}
                    bgColor="bg-blue-50"
                    iconColor="text-blue-600"
                    textColor="text-gray-800"
                    description="Being worked on"
                />
                
                <MyStatCard
                    title="Completed"
                    value={myCompleted}
                    icon={<CheckCircle className="w-6 h-6" />}
                    bgColor="bg-green-50"
                    iconColor="text-green-600"
                    textColor="text-gray-800"
                    description="Successfully resolved"
                />
                
                <MyStatCard
                    title="Total CRF"
                    value={myTotal}
                    icon={<FileText className="w-6 h-6" />}
                    bgColor="bg-purple-50"
                    iconColor="text-purple-600"
                    textColor="text-gray-800"
                    description={`${myThisMonth} this month`}
                />
                
            </div>
        </div>
    );
}