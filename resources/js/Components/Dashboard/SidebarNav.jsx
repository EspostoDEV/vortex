import React from 'react';
import { Link } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    ShieldCheck, 
    Activity, 
    Terminal, 
    Power 
} from 'lucide-react';

export default function SidebarNav() {
    const isCurrent = (path) => window.location.pathname === path;

    return (
        <nav className="fixed left-0 top-0 h-full w-[var(--sidebar-width)] bg-v-ebony border-r border-v-gray-800 flex flex-col items-center py-8 z-50">
            <div className="w-10 h-10 bg-v-black border border-v-gray-700 rounded-xl flex items-center justify-center mb-12 shadow-glow-success">
                <ShieldCheck className="text-v-success w-6 h-6" />
            </div>
            
            <div className="flex-1 flex flex-col items-center space-y-8">
                <Link 
                    href="/dashboard"
                    className={`p-3 rounded-xl transition-all flex items-center justify-center ${
                        isCurrent('/dashboard') 
                            ? 'bg-v-gray-900 text-v-success shadow-lg border border-v-success/20' 
                            : 'text-v-gray-600 hover:text-white'
                    }`}
                >
                    <LayoutDashboard size={24} />
                </Link>
                
                <Link 
                    href="/wizard"
                    className={`p-3 rounded-xl transition-all flex items-center justify-center ${
                        isCurrent('/wizard') 
                            ? 'bg-v-gray-900 text-v-success shadow-lg border border-v-success/20' 
                            : 'text-v-gray-600 hover:text-white'
                    }`}
                >
                    <Activity size={24} />
                </Link>

                <button className="p-3 text-v-gray-600 hover:text-white transition-colors flex items-center justify-center cursor-not-allowed opacity-50">
                    <Terminal size={24} />
                </button>
            </div>

            <Link 
                href="/logout" 
                method="post" 
                as="button"
                className="p-3 text-v-danger hover:bg-v-danger/10 rounded-xl transition-all flex items-center justify-center"
            >
                <Power size={24} />
            </Link>
        </nav>
    );
}
