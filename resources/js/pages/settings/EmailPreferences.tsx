import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

type User = {
    id: number;
    name: string;
    email: string;
    email_notifications_enabled: boolean;
    email_preferences: {
        crf_created?: boolean;
        crf_assigned?: boolean;
        crf_approved?: boolean;
        crf_rejected?: boolean;
        crf_completed?: boolean;
    } | null;
};

type Props = {
    user: User;
};

export default function EmailPreferences({ user }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        email_notifications_enabled: user.email_notifications_enabled,
        email_preferences: user.email_preferences || {
            crf_created: true,
            crf_assigned: true,
            crf_approved: true,
            crf_rejected: true,
            crf_completed: true,
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('settings.email-preferences.update'));
    };

    return (
        <AppLayout>
            <Head title="Email Preferences" />
            
            <div className="p-6">
                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Email Notification Preferences</CardTitle>
                        <CardDescription>
                            Control which email notifications you want to receive
                        </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Master Toggle */}
                            <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50">
                                <div>
                                    <Label htmlFor="master-toggle" className="text-base font-semibold">
                                        Email Notifications
                                    </Label>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Enable or disable all email notifications
                                    </p>
                                </div>
                                <Switch
                                    id="master-toggle"
                                    checked={data.email_notifications_enabled}
                                    onCheckedChange={(checked) => 
                                        setData('email_notifications_enabled', checked)
                                    }
                                />
                            </div>

                            {/* Individual Preferences */}
                            {data.email_notifications_enabled && (
                                <div className="space-y-4 border rounded-lg p-4">
                                    <h3 className="font-semibold text-sm text-gray-700">
                                        Notification Types
                                    </h3>

                                    <div className="space-y-3">
                                        {/* CRF Created */}
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label htmlFor="crf_created">
                                                    New CRF Created
                                                </Label>
                                                <p className="text-xs text-gray-500">
                                                    When a new CRF is submitted
                                                </p>
                                            </div>
                                            <Switch
                                                id="crf_created"
                                                checked={data.email_preferences.crf_created}
                                                onCheckedChange={(checked) =>
                                                    setData('email_preferences', {
                                                        ...data.email_preferences,
                                                        crf_created: checked,
                                                    })
                                                }
                                            />
                                        </div>

                                        {/* CRF Assigned */}
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label htmlFor="crf_assigned">
                                                    CRF Assigned to You
                                                </Label>
                                                <p className="text-xs text-gray-500">
                                                    When a CRF is assigned to you
                                                </p>
                                            </div>
                                            <Switch
                                                id="crf_assigned"
                                                checked={data.email_preferences.crf_assigned}
                                                onCheckedChange={(checked) =>
                                                    setData('email_preferences', {
                                                        ...data.email_preferences,
                                                        crf_assigned: checked,
                                                    })
                                                }
                                            />
                                        </div>

                                        {/* CRF Approved */}
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label htmlFor="crf_approved">
                                                    CRF Approved
                                                </Label>
                                                <p className="text-xs text-gray-500">
                                                    When a CRF is approved
                                                </p>
                                            </div>
                                            <Switch
                                                id="crf_approved"
                                                checked={data.email_preferences.crf_approved}
                                                onCheckedChange={(checked) =>
                                                    setData('email_preferences', {
                                                        ...data.email_preferences,
                                                        crf_approved: checked,
                                                    })
                                                }
                                            />
                                        </div>

                                        {/* CRF Rejected */}
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label htmlFor="crf_rejected">
                                                    CRF Rejected
                                                </Label>
                                                <p className="text-xs text-gray-500">
                                                    When a CRF is rejected
                                                </p>
                                            </div>
                                            <Switch
                                                id="crf_rejected"
                                                checked={data.email_preferences.crf_rejected}
                                                onCheckedChange={(checked) =>
                                                    setData('email_preferences', {
                                                        ...data.email_preferences,
                                                        crf_rejected: checked,
                                                    })
                                                }
                                            />
                                        </div>

                                        {/* CRF Completed */}
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label htmlFor="crf_completed">
                                                    CRF Completed
                                                </Label>
                                                <p className="text-xs text-gray-500">
                                                    When a CRF is marked as completed
                                                </p>
                                            </div>
                                            <Switch
                                                id="crf_completed"
                                                checked={data.email_preferences.crf_completed}
                                                onCheckedChange={(checked) =>
                                                    setData('email_preferences', {
                                                        ...data.email_preferences,
                                                        crf_completed: checked,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Save Button */}
                            <div className="flex justify-end gap-2">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : 'Save Preferences'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}