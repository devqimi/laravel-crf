// resources/js/components/dashboard/PICQuickActions.tsx

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { List, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function PICQuickActions() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link href="/crfs">
                        <Button className="w-full h-24 flex flex-col gap-2 bg-blue-600 hover:bg-blue-700">
                            <List className="h-6 w-6" />
                            <span className="text-sm">My Assignments</span>
                        </Button>
                    </Link>
                    
                    <Link href="/crfs?status=pending">
                        <Button variant="outline" className="w-full h-24 flex flex-col gap-2 hover:bg-gray-50">
                            <AlertCircle className="h-6 w-6" />
                            <span className="text-sm">Pending Action</span>
                        </Button>
                    </Link>
                    
                    <Link href="/crfs?status=in_progress">
                        <Button variant="outline" className="w-full h-24 flex flex-col gap-2 hover:bg-gray-50">
                            <Clock className="h-6 w-6" />
                            <span className="text-sm">In Progress</span>
                        </Button>
                    </Link>
                    
                    <Link href="/crfs?status=completed">
                        <Button variant="outline" className="w-full h-24 flex flex-col gap-2 hover:bg-gray-50">
                            <CheckCircle className="h-6 w-6" />
                            <span className="text-sm">Completed</span>
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}