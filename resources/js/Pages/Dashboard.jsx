import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    Activity, 
    Cpu, 
    Lock,
    Terminal,
    AlertCircle,
    LayoutDashboard
} from 'lucide-react';
import DashboardLayout from '@/Components/Dashboard/DashboardLayout';
import TwoFactorAuthenticationForm from './Profile/TwoFactorAuthenticationForm';

export default function Dashboard({ auth, providers, resources }) {
    const [selectedResource, setSelectedResource] = useState(null);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <DashboardLayout 
            resources={resources} 
            onResourceSelect={setSelectedResource}
            selectedResourceId={selectedResource?.id}
        >
            <Head title="Control Plane | Vortex" />
            
            <motion.header 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex justify-between items-end mb-12"
            >
                <div>
                    <div className="flex items-center gap-3 text-v-gray-500 text-xs font-bold tracking-widest uppercase mb-2">
                        <span className="w-2 h-2 rounded-full bg-v-success" />
                        System Operational
                    </div>
                    <h1 className="text-5xl font-bold tracking-tighter uppercase">
                        {selectedResource ? selectedResource.name : 'Control Plane'}
                    </h1>
                </div>
                
                <div className="text-right">
                    <p className="text-v-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Authenticated Operator</p>
                    <p className="text-xl font-semibold">{auth.user.name}</p>
                </div>
            </motion.header>

            <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
                {/* Status Cards */}
                <motion.div variants={item} className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-v-glass border border-v-gray-800 rounded-2xl p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Cpu size={80} />
                        </div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-v-success/10 rounded-lg">
                                <Activity className="text-v-success w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-sm uppercase tracking-wider text-v-gray-400">Kernel Analytics</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-v-gray-500 text-sm">Engine Status</span>
                                <span className="text-v-success font-mono text-sm font-bold uppercase">
                                    {selectedResource ? selectedResource.status : 'STABLE'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-v-gray-500 text-sm">Provider</span>
                                <span className="text-white font-mono text-sm">
                                    {selectedResource ? selectedResource.provider_name : 'LOCAL'}
                                </span>
                            </div>
                            <div className="w-full bg-v-gray-900 h-1.5 rounded-full overflow-hidden mt-2">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: selectedResource?.metrics?.cpu ? `${selectedResource.metrics.cpu}%` : '0%' }}
                                    className="h-full bg-v-success shadow-[0_0_10px_var(--v-success)]"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-v-glass border border-v-gray-800 rounded-2xl p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Lock size={80} />
                        </div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-v-warning/10 rounded-lg">
                                <Lock className="text-v-warning w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-sm uppercase tracking-wider text-v-gray-400">Security Layer</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-v-gray-500 text-sm">Vault Protocol</span>
                                <span className="text-v-warning font-mono text-sm font-bold">AES-256-GCM</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-v-gray-500 text-sm">Session TTL</span>
                                <span className="text-white font-mono text-sm">3600 SECONDS</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-v-gray-600 font-bold mt-2">
                                <AlertCircle size={12} className="text-v-success" />
                                DOUBLE-ENVELOPE ACTIVE
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <TwoFactorAuthenticationForm user={auth.user} />
                    </div>
                </motion.div>

                {/* Sidebar Info */}
                <motion.div variants={item} className="space-y-6">
                    <div className="bg-v-gray-900/50 border border-v-gray-800 rounded-2xl p-6">
                        <h3 className="flex items-center gap-2 font-bold text-sm uppercase tracking-wider text-v-gray-400 mb-6">
                            <Terminal size={16} />
                            Live Telemetry
                        </h3>
                        <div className="space-y-3 font-mono text-[10px]">
                            {selectedResource ? (
                                <>
                                    <div className="flex gap-3 text-v-gray-300">
                                        <span className="text-v-success">[OK]</span>
                                        <span>METRICS_RECEIVED: {selectedResource.name}</span>
                                    </div>
                                    <div className="flex gap-3 text-v-gray-400">
                                        <span className="text-v-success">[OK]</span>
                                        <span>CPU_LOAD: {selectedResource?.metrics?.cpu ?? 0}%</span>
                                    </div>
                                    <div className="flex gap-3 text-v-gray-400">
                                        <span className="text-v-success">[OK]</span>
                                        <span>RAM_USAGE: {selectedResource?.metrics?.ram ?? 0}%</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex gap-3 text-v-gray-600">
                                        <span className="text-v-success">[OK]</span>
                                        <span>VAULT_INITIALIZED_SUCCESS</span>
                                    </div>
                                    <div className="flex gap-3 text-v-gray-600">
                                        <span className="text-v-success">[OK]</span>
                                        <span>AUTH_GATE_READY</span>
                                    </div>
                                    <div className="flex gap-3 text-v-gray-400 animate-pulse">
                                        <span className="text-v-success">_</span>
                                        <span>AWAITING COMMAND...</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-v-accent/20 to-v-black border border-v-accent/30 rounded-2xl p-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-v-accent/20 rounded-xl">
                                <LayoutDashboard className="text-v-accent w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm mb-1">
                                    {providers.length > 0 ? 'Cluster Active' : 'Setup Required'}
                                </h4>
                                <p className="text-xs text-v-gray-400 leading-relaxed">
                                    {providers.length > 0 
                                        ? `Orchestrating ${resources.length} resources across ${providers.length} providers.`
                                        : 'Your control plane is isolated. Link a provider to start orchestrating resources.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </DashboardLayout>
    );
}
