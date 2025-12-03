import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { send } from '@/routes/verification';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';
import { useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: edit().url,
    },
];

type Department = {
    id: number;
    dname: string;
}

type User = {
    id: number;
    name: string;
    nric: string;
    email: string;
    phone: string;
    designation?: string;
    extno?: string;
    department_id?: number;
};

export default function Profile({
    mustVerifyEmail,
    status,
    departments,
}: {
    mustVerifyEmail: boolean;
    status?: string;
    departments: Department[];
}) {

    // const { data, setData, put, processing, errors } = useForm({
    //     name: user.name,
    //     nric: user.nric,
    //     email: user.email,
    //     phone: user.phone,
    //     designation: user.designation || '',
    //     extno: user.extno || '',
    //     department_id: user.department_id?.toString() || '',
    //     role: currentRole,
    // });

    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Profile information"
                        description="Update your information"
                    />

                    <Form
                        {...ProfileController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        className="space-y-6"
                    >
                        {({ processing, recentlySuccessful, errors }) => (
                            <>
                                {/* Name */}
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.name}
                                        name="name"
                                        required
                                        autoComplete="name"
                                        placeholder="Full name"
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.name}
                                    />
                                </div>

                                {/* NRIC */}
                                <div className="grid gap-2">
                                    <Label htmlFor="nric">NRIC</Label>

                                    <Input
                                        id="nric"
                                        type="text"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.nric || ''}
                                        name="nric"
                                        required
                                        placeholder="NRIC"
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.nric}
                                    />
                                </div>

                                {/* Email */}
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email address</Label>

                                    <Input
                                        id="email"
                                        type="email"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.email}
                                        name="email"
                                        required
                                        autoComplete="username"
                                        placeholder="Email address"
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.email}
                                    />
                                </div>

                                {/* Phone */}
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        type="text"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.phone || ''}
                                        name="phone"
                                        placeholder="Phone number"
                                    />
                                    <InputError className="mt-2" message={errors.phone} />
                                </div>

                                {/* Designation */}
                                <div className="grid gap-2">
                                    <Label htmlFor="designation">Designation</Label>
                                    <Input
                                        id="designation"
                                        type="text"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.designation || ''}
                                        name="designation"
                                        placeholder="Job title or designation"
                                    />
                                    <InputError className="mt-2" message={errors.designation} />
                                </div>

                                {/* Extension Number */}
                                <div className="grid gap-2">
                                    <Label htmlFor="extno">Ext Number</Label>
                                    <Input
                                        id="extno"
                                        type="text"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.extno || ''}
                                        name="extno"
                                        placeholder="Extension number"
                                    />
                                    <InputError className="mt-2" message={errors.extno} />
                                </div>

                                {/* Department */}
                                <div className="grid gap-2">
                                    <Label htmlFor="department_id">Department</Label>
                                    <select
                                        id="department_id"
                                        name="department_id"
                                        className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        defaultValue={auth.user.department_id || ''}
                                        required
                                    >
                                        <option value="">Select department</option>
                                        {departments.map((dept) => (
                                            <option key={dept.id} value={dept.id}>
                                                {dept.dname}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError className="mt-2" message={errors.department_id} />
                                </div>

                                {mustVerifyEmail &&
                                    auth.user.email_verified_at === null && (
                                        <div>
                                            <p className="-mt-4 text-sm text-muted-foreground">
                                                Your email address is
                                                unverified.{' '}
                                                <Link
                                                    href={send()}
                                                    as="button"
                                                    className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                                >
                                                    Click here to resend the
                                                    verification email.
                                                </Link>
                                            </p>

                                            {status ===
                                                'verification-link-sent' && (
                                                <div className="mt-2 text-sm font-medium text-green-600">
                                                    A new verification link has
                                                    been sent to your email
                                                    address.
                                                </div>
                                            )}
                                        </div>
                                    )}

                                <div className="flex items-center gap-4">
                                    <Button
                                        disabled={processing}
                                        data-test="update-profile-button"
                                    >
                                        Save
                                    </Button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-neutral-600">
                                            Saved
                                        </p>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
