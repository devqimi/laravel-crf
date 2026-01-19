import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { FileText, List, Clock, User } from 'lucide-react';

export default function QuickActions() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link href="/crfs/create">
                        <Button className="w-full h-24 flex flex-col gap-2 bg-blue-600 hover:bg-blue-700">
                            <FileText className="h-6 w-6" />
                            <span className="text-sm">Create New CRF</span>
                        </Button>
                    </Link>
                    
                    <Link href="/crfs">
                        <Button variant="outline" className="w-full h-24 flex flex-col gap-2 hover:bg-gray-50">
                            <List className="h-6 w-6" />
                            <span className="text-sm">View All CRFs</span>
                        </Button>
                    </Link>
                    
                    <Link href="/crfs/check-status">
                        <Button className="w-full h-24 flex flex-col gap-2 bg-yellow-600 hover:bg-yellow-700">
                            <Clock className="h-6 w-6" />
                            <span className="text-sm">Track Status</span>
                        </Button>
                    </Link>
                    
                    <Link href="/settings/profile">
                        <Button variant="outline" className="w-full h-24 flex flex-col gap-2 hover:bg-gray-50">
                            <User className="h-6 w-6" />
                            <span className="text-sm">My Profile</span>
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}