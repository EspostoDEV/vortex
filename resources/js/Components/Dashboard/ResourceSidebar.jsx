import React, { useState } from 'react';
import { Search, Server, Cloud, Cpu, Activity, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMetricStore } from '@/Stores/useMetricStore';

export default function ResourceSidebar({ onSelect, selectedId }) {
    const resources = useMetricStore(state => Object.values(state.resources));
    const [search, setSearch] = useState('');

    const filteredResources = React.useMemo(() => {
        if (!search) return resources;
        // Escape regex special characters
        const s = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').toLowerCase();
        return resources.filter(res => 
            res.name.toLowerCase().includes(s) ||
            res.type.toLowerCase().includes(s)
        );
    }, [resources, search]);

    const grouped = React.useMemo(() => {
        return filteredResources.reduce((acc, res) => {
            const key = res.provider_id || 'unlinked';
            if (!acc[key]) {
                acc[key] = {
                    name: res.provider_name || 'Unlinked',
                    items: []
                };
            }
            acc[key].items.push(res);
            return acc;
        }, {});
    }, [filteredResources]);

    const handleKeyDown = (e, res) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(res);
        }
    };

    return (
        <aside className="w-80 h-screen bg-v-black border-r border-v-gray-800 flex flex-col pt-8 overflow-hidden sticky top-0">
            <div className="px-6 mb-8">
                <h2 className="text-xs font-bold text-v-gray-500 uppercase tracking-widest mb-4">Infrastructure</h2>
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-v-gray-600 group-focus-within:text-v-success transition-colors" size={14} />
                    <input 
                        type="text" 
                        placeholder="Search resources..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-v-ebony border border-v-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-xs outline-none focus:border-v-success/50 transition-all placeholder:text-v-gray-700"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-12 space-y-8 scrollbar-thin scrollbar-thumb-v-gray-800">
                <AnimatePresence>
                    {Object.entries(grouped).map(([providerId, group]) => (
                        <div key={providerId}>
                            <h3 className="px-2 text-[10px] font-bold text-v-gray-600 uppercase tracking-tighter mb-3 flex items-center gap-2">
                                <Server size={10} />
                                {group.name}
                            </h3>
                            <div className="space-y-1">
                                {group.items.map((res) => (
                                    <motion.button
                                        key={res.id}
                                        layout
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        onClick={() => onSelect(res)}
                                        onKeyDown={(e) => handleKeyDown(e, res)}
                                        tabIndex={0}
                                        className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all group relative ${
                                            selectedId === res.id 
                                                ? 'bg-v-success/10 text-white' 
                                                : 'text-v-gray-400 hover:bg-v-gray-900 hover:text-v-gray-200'
                                        }`}
                                    >
                                        {selectedId === res.id && (
                                            <motion.div 
                                                layoutId="active-indicator"
                                                className="absolute left-0 w-1 h-4 bg-v-success rounded-full" 
                                            />
                                        )}
                                        
                                        <div className={`p-1.5 rounded-lg ${
                                            selectedId === res.id ? 'bg-v-success/20' : 'bg-v-gray-900'
                                        }`}>
                                            {res.type === 'vm' ? <Cpu size={14} /> : <Cloud size={14} />}
                                        </div>

                                        <div className="flex-1 text-left">
                                            <p className="text-xs font-bold truncate">{res.name}</p>
                                            <p className="text-[9px] text-v-gray-600 font-mono uppercase tracking-widest">{res.type}</p>
                                        </div>

                                        <div className="flex items-center gap-1.5">
                                            <div className={`w-1.5 h-1.5 rounded-full ${
                                                res.status === 'running' ? 'bg-v-success shadow-glow-success' : 'bg-v-gray-700'
                                            }`} />
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    ))}
                </AnimatePresence>
            </div>
        </aside>
    );
}
