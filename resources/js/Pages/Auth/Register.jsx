import React from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { UserPlus, User, Mail, Lock, ArrowRight } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/register', {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="bg-v-black min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            <Head title="Initialize Identity | Vortex" />
            
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-v-accent opacity-[0.03] blur-[120px] rounded-full" />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[440px] z-10"
            >
                <div className="bg-v-glass border border-v-gray-800 rounded-2xl p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-v-gray-900 border border-v-gray-800 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                            <UserPlus className="text-v-success w-8 h-8" strokeWidth={1.5} />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tighter text-white uppercase">Initialize Operator</h1>
                        <p className="text-v-gray-500 text-xs mt-2 uppercase tracking-widest font-bold">New Identity Protocol</p>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        <div className="group">
                            <label className="block text-[10px] font-bold text-v-gray-600 uppercase mb-2 ml-1 tracking-wider">Display Designation</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-v-gray-600 group-focus-within:text-v-success transition-colors" />
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="w-full bg-v-black/50 border border-v-gray-800 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:border-v-success outline-none transition-all placeholder:text-v-gray-700"
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>
                            {errors.name && <p className="text-v-danger text-[11px] mt-1 ml-1">{errors.name}</p>}
                        </div>

                        <div className="group">
                            <label className="block text-[10px] font-bold text-v-gray-600 uppercase mb-2 ml-1 tracking-wider">Communication Channel</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-v-gray-600 group-focus-within:text-v-success transition-colors" />
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    className="w-full bg-v-black/50 border border-v-gray-800 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:border-v-success outline-none transition-all placeholder:text-v-gray-700"
                                    placeholder="operator@vortex.engine"
                                    required
                                />
                            </div>
                            {errors.email && <p className="text-v-danger text-[11px] mt-1 ml-1">{errors.email}</p>}
                        </div>

                        <div className="group">
                            <label className="block text-[10px] font-bold text-v-gray-600 uppercase mb-2 ml-1 tracking-wider">Encryption Key</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-v-gray-600 group-focus-within:text-v-success transition-colors" />
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    className="w-full bg-v-black/50 border border-v-gray-800 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:border-v-success outline-none transition-all placeholder:text-v-gray-700"
                                    placeholder="••••••••••••"
                                    required
                                />
                            </div>
                            {errors.password && <p className="text-v-danger text-[11px] mt-1 ml-1">{errors.password}</p>}
                        </div>

                        <div className="group">
                            <label className="block text-[10px] font-bold text-v-gray-600 uppercase mb-2 ml-1 tracking-wider">Confirm Sequence</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-v-gray-600 group-focus-within:text-v-success transition-colors" />
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                    className="w-full bg-v-black/50 border border-v-gray-800 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:border-v-success outline-none transition-all placeholder:text-v-gray-700"
                                    placeholder="••••••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="group relative w-full bg-white hover:bg-v-success text-v-black font-bold py-4 rounded-xl transition-all duration-300 mt-6 active:scale-[0.98]"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {processing ? 'GENERATING PROTOCOLS...' : 'ESTABLISH IDENTITY'}
                                {!processing && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
                            </span>
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <Link href="/login" className="text-xs text-v-gray-500 hover:text-white underline underline-offset-4 transition-colors">
                            Already identified? Access Kernel
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
