import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import React, { useMemo } from 'react';
import InputError from '@/components/input-error';
import { Checkbox } from '@/components/ui/checkbox';

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
    designation?: string;
    extno?: string;
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
    const currentRoles = user.roles?.map((r: any) => r.name) || [];

    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        nric: user.nric,
        email: user.email,
        phone: user.phone,
        designation: user.designation || '',
        extno: user.extno || '',
        department_id: user.department_id?.toString() || '',
        roles: currentRoles,
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

                            <div className='mb-4'>
                                <Label htmlFor="designation">Designation</Label>
                                <Input 
                                    id="designation" 
                                    name="designation" 
                                    type="text" 
                                    value={data.designation} 
                                    onChange={(e) => setData('designation', e.target.value)} 
                                    aria-invalid={!!errors.designation} 
                                />
                                <InputError message={errors.designation} />
                            </div>
                            
                            <div className='mb-4'>
                                <Label htmlFor="extno">Ext No</Label>
                                <Input 
                                    id="extno" 
                                    name="extno" 
                                    type="text" 
                                    value={data.extno} 
                                    onChange={(e) => setData('extno', e.target.value)} 
                                    aria-invalid={!!errors.extno} 
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
                                    // Show all roles for IT department
                                    roles.map((role) => (
                                        <div key={role.id} className="flex items-center gap-2">
                                            <Checkbox
                                                id={`role-${role.id}`}
                                                checked={data.roles.includes(role.name)}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        setData('roles', [...data.roles, role.name]);
                                                    } else {
                                                        setData('roles', data.roles.filter((r) => r !== role.name));
                                                    }
                                                }}
                                            />
                                            <Label 
                                                htmlFor={`role-${role.id}`}
                                                className="cursor-pointer font-normal"
                                            >
                                                {role.name}
                                            </Label>
                                        </div>
                                    ))
                                ) : (
                                    // Show limited roles for non-IT
                                    availableRoles.map((role) => (
                                        <div key={role.id} className="flex items-center gap-2">
                                            <Checkbox
                                                id={`role-${role.id}`}
                                                checked={data.roles.includes(role.name)}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        setData('roles', [...data.roles, role.name]);
                                                    } else {
                                                        setData('roles', data.roles.filter((r) => r !== role.name));
                                                    }
                                                }}
                                            />
                                            <Label 
                                                htmlFor={`role-${role.id}`}
                                                className="cursor-pointer font-normal"
                                            >
                                                {role.name}
                                            </Label>
                                        </div>
                                    ))
                                )}

                                <InputError message={errors.roles} />
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