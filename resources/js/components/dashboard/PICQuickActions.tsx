// resources/js/components/dashboard/PICQuickActions.tsx

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { List, User } from 'lucide-react';

export default function PICQuickActions() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                    <Link href="/crfs">
                        <Button className="w-full h-24 flex flex-col gap-2 bg-blue-600 hover:bg-blue-700">
                            <List className="h-6 w-6" />
                            <span className="text-sm">My Assignments</span>
                        </Button>
                    </Link>
                    
                    <Link href="/settings/profile">
                        <Button variant="outline" className="w-full h-24 flex flex-col gap-2 hover:bg-gray-50">
                            <User className="h-6 w-6" />
                            <span className="text-sm">Profile</span>
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}