import React from 'react';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="p-8 border border-v-gray-medium rounded-lg bg-v-ebony shadow-2xl">
                    <h1 className="text-3xl font-bold text-white mb-4">Vortex Engine</h1>
                    <p className="text-v-text-secondary">
                        System initialized. Manual bootstrap complete.
                    </p>
                    <div className="mt-6 flex gap-4">
                        <span className="px-3 py-1 bg-v-gray-medium text-xs rounded text-v-success border border-v-gray-light">
                            PHP 8.4
                        </span>
                        <span className="px-3 py-1 bg-v-gray-medium text-xs rounded text-v-success border border-v-gray-light">
                            Laravel 11
                        </span>
                        <span className="px-3 py-1 bg-v-gray-medium text-xs rounded text-v-success border border-v-gray-light">
                            React 18
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}
