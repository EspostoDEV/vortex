import React from 'react';
import { motion } from 'framer-motion';
import { Server, Cloud, ShieldCheck, Cpu } from 'lucide-react';

export default function Introduction({ onNext }) {
    const providers = [
        { 
            name: 'Proxmox VE', 
            desc: 'Type-1 Hypervisor orchestration via API.', 
            icon: Server,
            status: 'Operational'
        },
        { 
            name: 'Docker Engine', 
            desc: 'Containerized service management.', 
            icon: Cloud,
            status: 'Operational'
        }
    ];

    return (
        <div className="space-y-12 relative z-10">
            <div>
                <h2 className="text-3xl font-bold tracking-tighter mb-4">INITIALIZING CONTROL PLANE</h2>
                <p className="text-v-gray-400 leading-relaxed max-w-2xl">
                    Welcome to the Vortex initialization protocol. To begin orchestrating your infrastructure, we need to establish a secure link with your hypervisors or container engines.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {providers.map((p, idx) => (
                    <motion.div 
                        key={p.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-v-ebony/50 border border-v-gray-800 p-6 rounded-2xl hover:border-v-success/30 transition-all group"
                    >
                        <div className="flex items-start justify-between mb-6">
                            <div className="p-3 bg-v-black rounded-xl border border-v-gray-800 group-hover:border-v-success/20 transition-colors">
                                <p.icon className="text-v-success" size={24} />
                            </div>
                            <span className="text-[10px] font-bold text-v-success uppercase tracking-widest bg-v-success/5 px-2 py-1 rounded">
                                {p.status}
                            </span>
                        </div>
                        <h3 className="font-bold mb-2 tracking-tight">{p.name}</h3>
                        <p className="text-xs text-v-gray-500 leading-relaxed">
                            {p.desc}
                        </p>
                    </motion.div>
                ))}
            </div>

            <div className="bg-v-success/5 border border-v-success/20 p-6 rounded-2xl flex items-start gap-4">
                <ShieldCheck className="text-v-success mt-1" size={20} />
                <div>
                    <h4 className="text-sm font-bold text-v-success mb-1">Double-Envelope Encryption</h4>
                    <p className="text-[11px] text-v-gray-400 leading-relaxed">
                        All credentials entered in the next step will be protected using your Master Key and the system Application Key. Secrets never leave the backend in plain text.
                    </p>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button 
                    onClick={onNext}
                    className="group bg-white hover:bg-v-success text-v-black px-10 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 shadow-lg active:scale-95"
                >
                    INITIALIZE PROTOCOL
                    <Cpu size={18} className="group-hover:rotate-12 transition-transform" />
                </button>
            </div>
        </div>
    );
}
