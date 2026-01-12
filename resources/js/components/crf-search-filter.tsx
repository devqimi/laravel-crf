import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X, Filter } from 'lucide-react';
import { router, usePage } from '@inertiajs/react';

interface SearchFilterProps {
    departments: Array<{ id: number; dname: string }>;
    categories: Array<{ id: number; cname: string }>;
    factors: Array<{ id: number; name: string }>;
}

export default function CRFSearchFilter({ departments, categories, factors }: SearchFilterProps) {

    const { url } = usePage();
    const urlParams = new URLSearchParams(window.location.search);

    const [search, setSearch] = useState(urlParams.get('search') || '');
    const [departmentId, setDepartmentId] = useState(urlParams.get('department_id') || 'all');
    const [categoryId, setCategoryId] = useState(urlParams.get('category_id') || 'all');
    const [factorId, setFactorId] = useState(urlParams.get('factor_id') || 'all');
    const [showFilters, setShowFilters] = useState(false);

    const isInitialMount = useRef(true);

    // Debounced search and filter
    useEffect(() => {

        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            const params: any = {};
            
            if (search) params.search = search;
            if (departmentId !== 'all') params.department_id = departmentId;
            if (categoryId !== 'all') params.category_id = categoryId;
            if (factorId !== 'all') params.factor_id = factorId;

            params.page = 1; // Reset to first page on filter change, to avoid empty results

            router.get('/crfs', params, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [search, departmentId, categoryId, factorId]);

    function clearAll() {
        setSearch('');
        setDepartmentId('all');
        setCategoryId('all');
        setFactorId('all');
    }

    const hasActiveFilters = search || departmentId !== 'all' || categoryId !== 'all' || factorId !== 'all';

    return (
        <div className="mb-4 space-y-3">
            
            {/* Search Bar */}
            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search by CRF number..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 pr-10"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
                <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className={showFilters ? 'bg-gray-100' : ''}
                >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                </Button>
                {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearAll}>
                        Clear All
                    </Button>
                )}
            </div>

            {/* Filters Section */}
            {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-gray-50 rounded-lg border">
                    {/* Department Filter */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Department</label>
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

                    {/* Category Filter */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Category</label>
                        <Select value={categoryId} onValueChange={setCategoryId}>
                            <SelectTrigger>
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id.toString()}>
                                        {cat.cname}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Factor Filter */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Factor</label>
                        <Select value={factorId} onValueChange={setFactorId}>
                            <SelectTrigger>
                                <SelectValue placeholder="All Factors" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Factors</SelectItem>
                                {factors.map((factor) => (
                                    <SelectItem key={factor.id} value={factor.id.toString()}>
                                        {factor.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            )}

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div className="flex flex-wrap gap-2">
                    {search && (
                        <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            Search: "{search}"
                            <button onClick={() => setSearch('')} className="hover:text-blue-900">
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    )}
                    {departmentId !== 'all' && (
                        <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                            Department: {departments.find(d => d.id.toString() === departmentId)?.dname}
                            <button onClick={() => setDepartmentId('all')} className="hover:text-green-900">
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    )}
                    {categoryId !== 'all' && (
                        <div className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                            Category: {categories.find(c => c.id.toString() === categoryId)?.cname}
                            <button onClick={() => setCategoryId('all')} className="hover:text-purple-900">
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    )}
                    {factorId !== 'all' && (
                        <div className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                            Factor: {factors.find(f => f.id.toString() === factorId)?.name}
                            <button onClick={() => setFactorId('all')} className="hover:text-orange-900">
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}