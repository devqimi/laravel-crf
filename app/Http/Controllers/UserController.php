<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Department;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::query()
        ->latest()
        ->paginate(10)
        ->withQueryString()
        ->through(fn($user) => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'created_at' => $user->created_at->format('d-m-Y'),
            'roles' => $user->roles->pluck('name'),
        ]);

        return inertia::render('users/index', [
            'users' => $users
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $departments = Department::all();
        
        return Inertia::render('users/create', [
            'departments' => $departments,
            'roles' => Role::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'nric' => 'required|string|max:20|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'designation' => 'required|string|max:255',
            'extno' => 'nullable|string|max:10',
            'roles' => 'array',
            'roles.*' => 'string|exists:roles,name',
            'department_id' => 'required|exists:departments,id', // Add this
            'role' => 'required|string|exists:roles,name', // Add this
        ]);

        $user = User::create([
            'name' => $request->name,
            'nric' => $request->nric,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'phone' => $request->phone,
            'designation' => $request->designation,
            'extno' => $request->extno,
            'department_id' => $request->department_id, // Add this

        ]);

        if ($request->role) {
            $user->assignRole($request->role);
        }

        return to_route('users.index')->with('message', 'User created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        return Inertia::render('users/edit', [
            'user' => $user->load('roles'),
            'departments' => Department::all(),
            'roles' => Role::all()
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,'.$user->id,
            'nric' => 'required|string|max:20|unique:users,nric,'.$user->id,
            'roles' => 'array',
            'roles.*' => 'string|exists:roles,name',
            'department_id' => 'required|exists:departments,id',
            'role' => 'required|string|exists:roles,name',
            'designation' => 'required',
            'extno' => 'nullable|string',
        ]);

        $user->update([
            'name' => $request->name,
            'nric' => $request->nric,
            'email' => $request->email,
            'phone' => $request->phone,
            'department_id' => $request->department_id,
            'designation' => $request->designation,
            'extno' => $request->extno,
        ]);

        if ($request->role) {
            $user->syncRoles($request->role);
        }

        return to_route('users.index')->with('message', 'User updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();

        return to_route('users.index')->with('message', 'User deleted successfully!');
    }
}
