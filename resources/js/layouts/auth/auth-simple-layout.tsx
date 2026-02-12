import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
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
            <div className="flex w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-blue-200 via-blue-300 to-indigo-500">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-4xl shadow-sm border border-gray-200 flex flex-col gap-8 p-6">
                        <div className="flex flex-col items-center gap-4">
                            <div>
                                <Link
                                    href={home()}
                                    className="flex flex-col items-center gap-2 font-medium"
                                >
                                    <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-md bg-blue-100">
                                        <AppLogoIcon className="size-9 fill-current text-blue-600" />
                                    </div>
                                    <span className="sr-only">{title}</span>
                                </Link>
                            </div>

                            <div className="space-y-2 text-center">
                                <h1 className="text-xl font-medium text-gray-900">{title}</h1>
                                <p className="text-center text-sm text-gray-600">
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