import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';
import InputError from '@/components/input-error';
import { Checkbox } from '@/components/ui/checkbox';
import { useMemo } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create User',
        href: '/users/create',
    },
];

type Department = {
    id: number;
    dname: string;
};

type Role = {
    id: number;
    name: string;
};

type RegisterProps = {
    departments: Department[]; // Make optional
    roles: Role[]; // Make optional
};

export default function CreateUsers({ departments = [], roles = [] }: RegisterProps) {

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        nric: '',
        email: '',
        password: '',
        phone: '',
        designation: '',
        extno: '',
        department_id: '',
        roles: [] as string[],
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
            // IT Department can select any role
            return roles;
        } else {
            // Other departments can only be USER or HOU
            return roles.filter((r) => r.name === 'USER' || r.name === 'HOU' || r.name === 'TIMBALAN PENGARAH');
        }
    }, [isITDepartment, roles]);
    
    // Auto-set role to USER when non-IT department is selected
    const handleDepartmentChange = (departmentId: string) => {
        const dept = departments.find((d) => d.id === parseInt(departmentId));
        
        // Update both values at once
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
        post('/users');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create User" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 bg-gray-100">
                <Card>
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle>Create User</CardTitle>
                        <CardAction>
                            <Link href={'/users'}>
                                <Button variant={'default'} >Go Back</Button>
                            </Link>
                        </CardAction>
                    </CardHeader>
                    <hr />
                    <CardContent>
                        <form onSubmit={submit}>
                            <div className='mb-4'>
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} aria-invalid={!!errors.name} />
                                <InputError message={errors.name} />
                            </div>
                            <div className='mb-4'>
                                <Label htmlFor="name">NRIC</Label>
                                <Input id="nric" name="nric" type="text" value={data.nric} onChange={(e) => setData('nric', e.target.value)} aria-invalid={!!errors.nric} />
                                <InputError message={errors.nric} />
                            </div>
                            <div className='mb-4'>
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} aria-invalid={!!errors.email} />
                                <InputError message={errors.email} />
                            </div>
                            <div className='mb-4'>
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" name="password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} aria-invalid={!!errors.password} />
                                <InputError message={errors.password} />
                            </div>
                            <div className='mb-4'>
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" name="phone" type="text" value={data.phone} onChange={(e) => setData('phone', e.target.value)} aria-invalid={!!errors.phone} />
                                <InputError message={errors.phone} />
                            </div>
                            <div className='mb-4'>
                                <Label htmlFor="designation">Designation</Label>
                                <Input id="designation" name="designation" type="text" value={data.designation} onChange={(e) => setData('designation', e.target.value)} aria-invalid={!!errors.designation} />
                                <InputError message={errors.designation} />
                            </div>
                            <div className='mb-4'>
                                <Label htmlFor="extno">Ext No</Label>
                                <Input id="extno" name="extno" type="text" value={data.extno} onChange={(e) => setData('extno', e.target.value)} aria-invalid={!!errors.extno} />
                                <InputError message={errors.extno} />
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
                                        <option
                                            key={d.id}
                                            value={d.id}
                                            className="text-black">
                                            {d.dname}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.department_id} />
                            </div>

                            <div className="grid gap-2 mb-4">
                                <Label>Roles</Label>
                                
                                {isITDepartment ? (
                                    // IT Department can select any roles
                                    <div className="space-y-3 border rounded-lg p-4">
                                        {availableRoles.map((role) => (
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
                                        ))}
                                    </div>
                                ) : (
                                    // Non-IT departments can only select USER, HOU, or TP
                                    <div className="space-y-3 border rounded-lg p-4">
                                        {availableRoles.map((role) => (
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
                                        ))}
                                    </div>
                                )}

                                <InputError message={errors.roles} />
                                
                                {!isITDepartment && (
                                    <p className="text-xs text-gray-500">
                                        Non-IT departments can only be assigned USER, HOU, or TP roles
                                    </p>
                                )}
                                
                                <p className="text-xs text-gray-500">
                                    Select one or more roles for this user
                                </p>
                            </div>

                            {/* <Label>Select Roles</Label>
                            <div className='my-4'>
                                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'>
                                    {roles.map((role) => (
                                        <div key={role} className="flex items-center gap-3">
                                            <Checkbox
                                                id={role}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        setData('roles', [...data.roles, role]);
                                                    } else {
                                                        setData('roles', data.roles.filter((p) => p !== role));
                                                    }
                                                }}
                                            />
                                            <Label htmlFor={role}>{role}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div> */}

                            <div className='flex justify-end'>
                                <Button size={'lg'} type='submit' disabled={processing}>
                                    Create
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}