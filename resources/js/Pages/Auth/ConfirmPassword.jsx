import React from 'react';
import { useForm, Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ShieldAlert, Lock, ArrowRight } from 'lucide-react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/user/confirm-password', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="bg-v-black min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans">
            <Head title="Elevated Access | Vortex" />
            
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-v-warning opacity-[0.03] blur-[120px] rounded-full" />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[440px] z-10"
            >
                <div className="bg-v-glass border border-v-gray-800 rounded-2xl p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-v-warning to-transparent opacity-50" />

                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-v-gray-900 border border-v-gray-800 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                            <ShieldAlert className="text-v-warning w-8 h-8" strokeWidth={1.5} />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tighter text-white uppercase">Elevated Access</h1>
                        <p className="text-v-gray-400 text-xs mt-2 text-center uppercase tracking-widest font-bold">Secure Zone Re-authentication</p>
                    </div>

                    <p className="text-v-gray-500 text-sm mb-8 text-center leading-relaxed">
                        This is a secure area of the engine. Please confirm your operational key to proceed with identity upgrades.
                    </p>

                    <form onSubmit={submit} className="space-y-6">
                        <div className="group">
                            <label className="block text-[10px] font-bold text-v-gray-600 uppercase mb-2 ml-1 tracking-wider">Operational Key</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-v-gray-600 group-focus-within:text-v-warning transition-colors" />
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    className="w-full bg-v-black/50 border border-v-gray-800 rounded-xl pl-12 pr-4 py-4 text-sm text-white focus:border-v-warning outline-none transition-all placeholder:text-v-gray-700"
                                    placeholder="••••••••••••"
                                    required
                                    autoFocus
                                />
                            </div>
                            {errors.password && <p className="text-v-danger text-[11px] mt-2 ml-1">{errors.password}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="group relative w-full bg-v-warning text-v-black font-bold py-4 rounded-xl transition-all duration-300 shadow-[0_10px_20px_rgba(255,184,0,0.1)] active:scale-[0.98]"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {processing ? 'VALIDATING...' : 'CONFIRM IDENTITY'}
                                {!processing && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
                            </span>
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
