import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import React, { useMemo } from 'react';
import InputError from '@/components/input-error';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Edit User',
        href: '/users',
    },
];

type User = {
    id: number;
    name: string;
    nric: string;
    email: string;
    phone: string;
    department_id: number;
    roles: Array<{ name: string }>; // User's current roles
};

type Department = {
    id: number;
    dname: string;
};

type Role = {
    id: number;
    name: string;
};

type Props = {
    departments: Department[];
    roles: Role[];
    user: User;
};

export default function EditUsers({ departments = [], roles = [], user }: Props) {
    // Get user's current role (first role)
    const currentRole = user.roles && user.roles.length > 0 ? user.roles[0].name : '';

    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        nric: user.nric,
        email: user.email,
        phone: user.phone,
        department_id: user.department_id?.toString() || '',
        role: currentRole,
    });

    // Check if selected department is "Unit Teknologi Maklumat"
    const selectedDepartment = useMemo(() => {
        return departments.find(
            (d) => d.id === parseInt(data.department_id)
        );
    }, [data.department_id, departments]);

    const isITDepartment = selectedDepartment?.dname === 'Unit Teknologi Maklumat';

    // Filter roles based on department
    const availableRoles = useMemo(() => {
        if (isITDepartment) {
            return roles;
        } else {
            return roles.filter((r) => r.name === 'USER' || r.name === 'HOU' || r.name === 'TIMBALAN PENGARAH');
        }
    }, [isITDepartment, roles]);
    
    // Auto-set role when department changes
    const handleDepartmentChange = (departmentId: string) => {
        const dept = departments.find((d) => d.id === parseInt(departmentId));
        
        if (dept && dept.dname !== 'Unit Teknologi Maklumat') {
            setData({
                ...data,
                department_id: departmentId,
                role: 'USER'
            });
        } else {
            setData({
                ...data,
                department_id: departmentId,
                role: ''
            });
        }
    };

    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        put(`/users/${user.id}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit User" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle>Edit User</CardTitle>
                        <CardAction>
                            <Link href={'/users'}>
                                <Button variant={'default'}>Go Back</Button>
                            </Link>
                        </CardAction>
                    </CardHeader>
                    <hr />
                    <CardContent>
                        <form onSubmit={submit}>
                            <div className='mb-4'>
                                <Label htmlFor="name">Name</Label>
                                <Input 
                                    id="name" 
                                    name="name" 
                                    type="text" 
                                    value={data.name} 
                                    onChange={(e) => setData('name', e.target.value)} 
                                    aria-invalid={!!errors.name} 
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className='mb-4'>
                                <Label htmlFor="nric">NRIC</Label>
                                <Input 
                                    id="nric" 
                                    name="nric" 
                                    type="text" 
                                    value={data.nric} 
                                    onChange={(e) => setData('nric', e.target.value)} 
                                    aria-invalid={!!errors.nric} 
                                />
                                <InputError message={errors.nric} />
                            </div>

                            <div className='mb-4'>
                                <Label htmlFor="email">Email</Label>
                                <Input 
                                    id="email" 
                                    name="email" 
                                    type="email" 
                                    value={data.email} 
                                    onChange={(e) => setData('email', e.target.value)} 
                                    aria-invalid={!!errors.email} 
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className='mb-4'>
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input 
                                    id="phone" 
                                    name="phone" 
                                    type="text" 
                                    value={data.phone} 
                                    onChange={(e) => setData('phone', e.target.value)} 
                                    aria-invalid={!!errors.phone} 
                                />
                                <InputError message={errors.phone} />
                            </div>

                            <div className="grid gap-2 mb-4">
                                <Label htmlFor="department_id">Department</Label>
                                <select
                                    id="department_id"
                                    className="rounded border px-2 py-1"
                                    value={data.department_id}
                                    onChange={(e) => handleDepartmentChange(e.target.value)}
                                    required
                                >
                                    <option value="">Select department</option>
                                    {departments.map((d) => (
                                        <option key={d.id} value={d.id}>
                                            {d.dname}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.department_id} />
                            </div>

                            <div className="grid gap-2 mb-4">
                                <Label htmlFor="role">Role</Label>
                                {isITDepartment ? (
                                    <select
                                        id="role"
                                        className="rounded border px-2 py-1"
                                        value={data.role}
                                        onChange={(e) => setData('role', e.target.value)}
                                        required
                                    >
                                        <option value="">Select role</option>
                                        {availableRoles.map((r) => (
                                            <option key={r.id} value={r.name}>
                                                {r.name}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="role"
                                                value="USER"
                                                checked={data.role === 'USER'}
                                                onChange={(e) => setData('role', e.target.value)}
                                                className="h-4 w-4"
                                                required
                                            />
                                            <span>USER</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="role"
                                                value="HOU"
                                                checked={data.role === 'HOU'}
                                                onChange={(e) => setData('role', e.target.value)}
                                                className="h-4 w-4"
                                                required
                                            />
                                            <span>HOU</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="role"
                                                value="TIMBALAN PENGARAH"
                                                checked={data.role === 'TIMBALAN PENGARAH'}
                                                onChange={(e) => setData('role', e.target.value)}
                                                className="h-4 w-4"
                                                required
                                            />
                                            <span>Timbalan Pengarah</span>
                                        </label>
                                    </div>
                                )}

                                <InputError message={errors.role} />
                                {!isITDepartment && (
                                    <p className="text-xs text-gray-500">
                                        Non-IT departments can only be assigned USER, HOU, or TP roles
                                    </p>
                                )}
                            </div>

                            <div className='flex justify-end'>
                                <Button size={'lg'} type='submit' disabled={processing}>
                                    Update
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}