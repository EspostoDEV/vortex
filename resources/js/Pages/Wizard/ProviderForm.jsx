import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Key, Globe, Layout, ShieldAlert } from 'lucide-react';

export default function ProviderForm({ data, setData, onBack, onNext }) {
    const handleTypeSelect = (type) => setData({ ...data, provider_type: type });

    const isFormValid = data.name && data.url && data.token_id && data.token_secret;

    return (
        <div className="space-y-10 relative z-10">
            <div>
                <h2 className="text-3xl font-bold tracking-tighter mb-4">RESOURCE CONFIGURATION</h2>
                <p className="text-v-gray-400 text-sm">Enter the technical parameters to establish the secure link.</p>
            </div>

            {/* Provider Toggle */}
            <div className="flex p-1 bg-v-black rounded-2xl border border-v-gray-800 w-fit">
                <button 
                    onClick={() => handleTypeSelect('proxmox')}
                    className={`px-8 py-3 rounded-xl text-xs font-bold transition-all ${data.provider_type === 'proxmox' ? 'bg-v-ebony text-v-success shadow-lg' : 'text-v-gray-600 hover:text-v-gray-400'}`}
                >
                    PROXMOX VE
                </button>
                <button 
                    onClick={() => handleTypeSelect('docker')}
                    className={`px-8 py-3 rounded-xl text-xs font-bold transition-all ${data.provider_type === 'docker' ? 'bg-v-ebony text-v-success shadow-lg' : 'text-v-gray-600 hover:text-v-gray-400'}`}
                >
                    DOCKER
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-v-gray-600 uppercase tracking-widest flex items-center gap-2">
                            <Layout size={12} />
                            Connection Name
                        </label>
                        <input 
                            type="text" 
                            placeholder="Primary Lab Cluster"
                            value={data.name}
                            onChange={e => setData({...data, name: e.target.value})}
                            className="w-full bg-v-black border border-v-gray-800 rounded-xl px-5 py-4 text-sm outline-none focus:border-v-success focus:ring-1 focus:ring-v-success/20 transition-all font-medium"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-v-gray-600 uppercase tracking-widest flex items-center gap-2">
                            <Globe size={12} />
                            API Endpoint URL
                        </label>
                        <input 
                            type="text" 
                            placeholder="https://192.168.1.100:8006/api2/json"
                            value={data.url}
                            onChange={e => setData({...data, url: e.target.value})}
                            className="w-full bg-v-black border border-v-gray-800 rounded-xl px-5 py-4 text-sm outline-none focus:border-v-success focus:ring-1 focus:ring-v-success/20 transition-all font-mono"
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-v-gray-600 uppercase tracking-widest flex items-center gap-2">
                            <Key size={12} />
                            Token / Client ID
                        </label>
                        <input 
                            type="text" 
                            placeholder="vortex-token@pve"
                            value={data.token_id}
                            onChange={e => setData({...data, token_id: e.target.value})}
                            className="w-full bg-v-black border border-v-gray-800 rounded-xl px-5 py-4 text-sm outline-none focus:border-v-success focus:ring-1 focus:ring-v-success/20 transition-all font-mono"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-v-gray-600 uppercase tracking-widest flex items-center gap-2">
                            <ShieldAlert size={12} />
                            Secret / Token Key
                        </label>
                        <input 
                            type="password" 
                            placeholder="••••••••••••••••"
                            value={data.token_secret}
                            onChange={e => setData({...data, token_secret: e.target.value})}
                            className="w-full bg-v-black border border-v-gray-800 rounded-xl px-5 py-4 text-sm outline-none focus:border-v-success focus:ring-1 focus:ring-v-success/20 transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center pt-8 border-t border-v-gray-800/50">
                <button 
                    onClick={onBack}
                    className="text-v-gray-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-2"
                >
                    <ChevronLeft size={16} />
                    Back
                </button>
                <button 
                    onClick={onNext}
                    disabled={!isFormValid}
                    className="bg-v-success text-v-black px-10 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 shadow-glow-success disabled:opacity-30 disabled:grayscale disabled:shadow-none active:scale-95"
                >
                    VALIDATE CONNECTION
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
}
