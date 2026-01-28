import { Pagination } from "./pagination";
import { SingleRole } from "./roles";

type Department = {
    id: number;
    dname: string;
};

export interface SingleUser {
    id: number;
    name: string;
    nric: string;
    email: string;
    phone: string;
    roles: string[];
    department_id: int;
    department?: Department;
    created_at: string;
}

export interface User extends Pagination {
    data: SingleUser[];
}

export interface UserRole extends SingleUser {
    roles: SingleRole[];
}