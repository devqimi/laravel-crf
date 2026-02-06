import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import TablePagination from '@/components/table-pagination';
import { router } from '@inertiajs/core';
import { usePermission } from '@/hooks/user-permissions';
import { Search, X, CircleUser } from 'lucide-react';
import { Label } from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];

type Department = {
    id: number;
    dname: string;
};

type User = {
    id: number;
    name: string;
    nric: string;
    email: string;
    department_id: number | null;
};

type PaginatedUsers = {
    data: (User & { roles: string[]; created_at: string })[];
    total: number;
    from: number;
    to: number;
    links: any[];
};

type Props = {
    users: PaginatedUsers;
    departments: Department[];
};

export default function Users({ users, departments }: Props) {

    const {flash} = usePage<{flash: {message?: string}} >().props;
    const {can} = usePermission();
    
    const urlParams = new URLSearchParams(window.location.search);
    const [search, setSearch] = useState(urlParams.get('search') || '');
    const [departmentId, setDepartmentId] = useState(urlParams.get('department_id') || 'all');

    const isInitialMount = useRef(true);
    
    // Debounced search and filter
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            const params: Record<string, any> = {};
            
            if (search) params.search = search;
            if (departmentId !== 'all') params.department_id = departmentId;

            params.page = 1;

            router.get('/users', params, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [search, departmentId]);

    useEffect (() => {
        if (flash.message) {
            toast.success(flash.message);
        }
    }, [flash.message]);        

    function deleteUser(id: number){
        if (confirm("Are you sure you want to delete this user?")) {
            router.delete(`users/${id}`);
        }
    }

    function clearSearch() {
        setSearch('');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 bg-gray-100">
                <div className="mt-1 ml-1 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white shadow-lg rounded-lg p-4">
                    <h1 className="text-3xl font-bold mb-2">
                        <CircleUser className="inline-block mr-2 size-8" />
                        User Management
                    </h1>
                    <p>Manage Users here.</p>
                </div>
                <Card>
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle>User Management</CardTitle>
                        <CardAction>
                            {can('create user') && (
                                <Link href={'users/create'}>
                                    <Button variant={'default'} >Add New</Button>
                                </Link>
                            )}
                        </CardAction>
                    </CardHeader>
                    <hr />
                    <CardContent>

                        {/* Search Bar and Department Filter*/}
                        <div className="mb-4 flex items-center gap-4">

                            {/* Search Bar */}
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search by name..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10 pr-10"
                                />
                                {search && (
                                    <button
                                        onClick={clearSearch}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>

                            {/* Department Filter */}
                            <div className="w-100">
                                <Select value={departmentId} onValueChange={setDepartmentId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Departments" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Departments</SelectItem>
                                        {departments.map((dept) => (
                                            <SelectItem key={dept.id} value={dept.id.toString()}>
                                                {dept.dname}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <Table>
                            <TableHeader className="bg-blue-900">
                                <TableRow>
                                    <TableHead className='font-bold text-white'>No</TableHead>
                                    <TableHead className='font-bold text-white'>Name</TableHead>
                                    <TableHead className='font-bold text-white'>Email</TableHead>
                                    <TableHead className='font-bold text-white'>Roles</TableHead>
                                    <TableHead className='font-bold text-white'>Department</TableHead>
                                    <TableHead className='font-bold text-white'>Created At</TableHead>
                                    <TableHead className='font-bold text-white'>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.data.map((user, index) => (
                                    <TableRow key={user.id} className='odd:bg-slate-100 dark:odd:bg-slate-800'>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {user.roles.map((role: string) => (
                                                    <span 
                                                        key={role}
                                                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                                    >
                                                        {role}
                                                    </span>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell>{departments?.find(d => d.id === user.department_id)?.dname || '-'}</TableCell>
                                        <TableCell>{user.created_at}</TableCell>
                                        <TableCell>
                                            {can('update users') && (
                                                <Link href={`users/${user.id}/edit`}>
                                                    <Button variant={'outline'} size={'sm'}>
                                                        Edit
                                                    </Button>
                                                </Link>
                                            )}
                                            {can('delete user') && (
                                                <Button className='m-2' variant={'destructive'} size={'sm'} onClick={() => deleteUser(user.id)}>
                                                    Delete
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                    {users.data.length > 0 ? (
                        <TablePagination total={users.total} from={users.from} to={users.to} links={users.links} />
                    ): (
                        <div className='flex h-full items-center justify-center'>No Results Found!</div>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}