import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { CheckCircle, Clock, FileText, XCircle, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

type Activity = {
    id: number;
    crf_id: number;
    message: string;
    type: 'created' | 'approved' | 'in_progress' | 'completed' | 'pending';
    created_at: string;
};

interface RecentActivityProps {
    activities: Activity[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'completed':
                return <CheckCircle className="h-5 w-5" />;
            case 'in_progress':
                return <Clock className="h-5 w-5" />;
            case 'pending':
                return <AlertCircle className="h-5 w-5" />;
            case 'approved':
                return <CheckCircle className="h-5 w-5" />;
            default:
                return <FileText className="h-5 w-5" />;
        }
    };

    const getActivityColor = (type: string) => {
        switch (type) {
            case 'completed':
                return 'bg-green-100 text-green-600';
            case 'in_progress':
                return 'bg-blue-100 text-blue-600';
            case 'pending':
                return 'bg-orange-100 text-orange-600';
            case 'approved':
                return 'bg-green-100 text-green-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                {activities.length > 0 ? (
                    <div className="space-y-3">
                        {activities.map((activity) => (
                            <Link
                                key={activity.id}
                                href={`/crfs/${activity.crf_id}`}
                                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                                    {getActivityIcon(activity.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900">
                                        {activity.message}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {formatDistanceToNow(new Date(activity.created_at), { 
                                            addSuffix: true 
                                        })}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">No recent activity</p>
                        <p className="text-xs text-gray-400 mt-1">
                            Your CRF updates will appear here
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}