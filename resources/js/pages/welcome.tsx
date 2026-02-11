import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, BarChart3, Bell, CheckCircle, Clock, FileText, Shield, TrendingUp, Users } from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=inter:400,500,600,700"
                    rel="stylesheet"
                />
            </Head>

            {/* Full Page Container */}
            <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-200 via-blue-300 to-indigo-500">

                {/* Fixed Top Navigation Bar */}
                <header className="bg-white border-b border-slate-200 shadow-sm">
                    <div className="max-w-7xl mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            {/* Logo and Title */}
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-600 p-2 rounded-lg">
                                    <FileText className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-slate-900">Hospital Sultan Idris Shah Serdang</h1>
                                    <p className="text-xs text-slate-500">Customer Request Form</p>
                                </div>
                            </div>

                            {/* Navigation */}
                            <nav className="flex items-center gap-3">
                                {auth.user ? (
                                    <Link
                                        href="/dashboard"
                                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
                                    >
                                        Dashboard
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            className="inline-block rounded-lg px-5 py-2.5 font-medium text-slate-700 transition-colors hover:bg-slate-100"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
                                        >
                                            Register
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                <main className="flex-1 flex items-center justify-center px-6 py-57">
                    <div className="max-w-7xl grid md:grid-cols-2 gap-12 items-center">

                        {/* Left Content */}
                        <div>
                            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                                <Shield className="h-4 w-4" />
                                Secure Internal System
                            </div>
                            <h1 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">
                                Customer Request Form System
                            </h1>
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                Submit, track, and manage requests efficiently. Our integrated system ensures quick response times and complete transparency throughout the resolution process.
                            </p>
                        </div>

                        {/* Right Simple Card */}
                        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">How It Works</h3>
                            <ul className="space-y-3 text-sm text-slate-600">
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span>Submit your request online in minutes</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Clock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <span>Track status and updates in real-time</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Users className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                    <span>Get support from our dedicated team</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-slate-900 text-slate-400 py-8">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid md:grid-cols-4 gap-8 mb-8">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="bg-blue-600 p-1.5 rounded">
                                        <FileText className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="font-semibold text-white">Customer Request Form</span>
                                </div>
                                <p className="text-sm">
                                    HSIS internal request form system for efficient service delivery.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-white mb-3">Quick Links</h4>
                                <ul className="space-y-2 text-sm">
                                    <li><a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a></li>
                                    <li><a href="/crfs/create" className="hover:text-white transition-colors">Submit Request</a></li>
                                    <li><a href="/crfs" className="hover:text-white transition-colors">Track Status</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-white mb-3">Support</h4>
                                <ul className="space-y-2 text-sm">
                                    <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">User Guide</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Contact IT</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-white mb-3">Contact</h4>
                                <ul className="space-y-2 text-sm">
                                    <li>Call Center IT</li>
                                    <li>Ext: 1840/1841/1842</li>
                                    <li><a href="http://hsislink.moh.gov.my/FireFox_Shortcut/shortcut_ff.html" className="hover:text-white transition-colors">HSIS Web Shortcut Portal</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-sm">
                                © {new Date().getFullYear()} Hospital CRF System. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}