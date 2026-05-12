import React from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Shield, Lock, User, ArrowRight } from 'lucide-react';

export default function Login() {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/login', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="bg-v-black min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans">
            <Head title="Access Control | Vortex" />
            
            {/* Animated background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-v-accent opacity-[0.03] blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-v-success opacity-[0.03] blur-[120px] rounded-full" />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-[440px] z-10"
            >
                <div className="bg-v-glass border border-v-gray-800 rounded-2xl p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
                    {/* Top Accent Line */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-v-success to-transparent opacity-50" />

                    <div className="flex flex-col items-center mb-10">
                        <div className="w-16 h-16 bg-v-gray-900 border border-v-gray-800 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                            <Shield className="text-v-success w-8 h-8" strokeWidth={1.5} />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tighter text-white">VORTEX</h1>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="w-2 h-2 rounded-full bg-v-success animate-pulse" />
                            <p className="text-v-gray-400 text-xs font-medium uppercase tracking-widest">Secure Entry Point</p>
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
                        <div className="group">
                            <label className="block text-[10px] font-bold text-v-gray-600 uppercase mb-2 ml-1 tracking-wider">Operational ID</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-v-gray-600 group-focus-within:text-v-success transition-colors" />
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    className="w-full bg-v-black/50 border border-v-gray-800 rounded-xl pl-12 pr-4 py-4 text-sm text-white focus:border-v-success focus:ring-1 focus:ring-v-success/20 outline-none transition-all placeholder:text-v-gray-700"
                                    placeholder="operator@vortex.engine"
                                    required
                                />
                            </div>
                            {errors.email && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-v-danger text-[11px] mt-2 ml-1">{errors.email}</motion.p>}
                        </div>

                        <div className="group">
                            <label className="block text-[10px] font-bold text-v-gray-600 uppercase mb-2 ml-1 tracking-wider">Access Sequence</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-v-gray-600 group-focus-within:text-v-success transition-colors" />
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    className="w-full bg-v-black/50 border border-v-gray-800 rounded-xl pl-12 pr-4 py-4 text-sm text-white focus:border-v-success focus:ring-1 focus:ring-v-success/20 outline-none transition-all placeholder:text-v-gray-700"
                                    placeholder="••••••••••••"
                                    required
                                />
                            </div>
                            {errors.password && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-v-danger text-[11px] mt-2 ml-1">{errors.password}</motion.p>}
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={e => setData('remember', e.target.checked)}
                                        className="peer sr-only"
                                    />
                                    <div className="w-5 h-5 bg-v-black border border-v-gray-800 rounded-md peer-checked:bg-v-success peer-checked:border-v-success transition-all" />
                                    <svg className="absolute w-3 h-3 text-v-black opacity-0 peer-checked:opacity-100 left-[4px] pointer-events-none transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                        <path d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-xs text-v-gray-500 group-hover:text-v-gray-300 transition-colors">Persistent Session</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="group relative w-full bg-white hover:bg-v-success text-v-black font-bold py-4 rounded-xl transition-all duration-300 overflow-hidden shadow-[0_10px_20px_rgba(255,255,255,0.05)] active:scale-[0.98]"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {processing ? 'ESTABLISHING LINK...' : 'AUTHORIZE ACCESS'}
                                {!processing && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
                            </span>
                        </button>
                    </form>

                    <div className="mt-10 flex items-center justify-center gap-4 text-[9px] uppercase tracking-[0.2em] text-v-gray-700 font-bold">
                        <span className="w-1 h-1 rounded-full bg-v-gray-800" />
                        AES-256-GCM PROTECTED
                        <span className="w-1 h-1 rounded-full bg-v-gray-800" />
                    </div>
                </div>
                
                <p className="text-center mt-8 text-v-gray-600 text-xs font-medium">
                    Don't have credentials? <Link href="/register" className="text-v-gray-400 hover:text-white transition-colors underline-offset-4 underline">Request Identity</Link>
                </p>
            </motion.div>
        </div>
    );
}
