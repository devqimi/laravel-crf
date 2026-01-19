import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { Shield } from 'lucide-react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="flex min-h-svh">
            
            {/* Left Side - Text/Design */}
            <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-500 to-blue-900 flex-col items-center justify-center p-10 text-white">
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                        <Shield className="h-4 w-4" />
                        Secure Internal System
                    </div>
                    <h1 className="text-4xl font-bold">Customer Request Form</h1>
                    <div className="space-y-4">
                        <h2 className="text-3xl font-semibold">Welcome !</h2>
                        <p className="text-lg opacity-90">
                            Sign in to access your account and start submitting requests.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Auth Container */}
            <div className="flex w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-slate-100 to-blue-400 relative overflow-hidden">

                {/* Background Pattern Overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1)_0%,_transparent_50%)] bg-[length:20px_20px]"></div>
                <div className="w-full max-w-md relative z-10">
                    <div className="border border-black bg-accent rounded-4xl shadow-sm flex flex-col gap-8 p-6 shadow-md dark:border-gray-900">
                        <div className="flex flex-col items-center gap-4">
                            
                            <div className="">
                                <Link
                                    href={home()}
                                    className="flex flex-col items-center gap-2 font-medium"
                                >
                                    <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-md dark:text-black">
                                        <AppLogoIcon className="size-9 fill-current text-[var(--foreground)] dark:text-white" />
                                    </div>
                                    <span className="sr-only">{title}</span>
                                </Link>
                            </div>

                            <div className="space-y-2 text-center">
                                <h1 className="text-xl font-medium">{title}</h1>
                                <p className="text-center text-sm text-muted-foreground">
                                    {description}
                                </p>
                            </div>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}