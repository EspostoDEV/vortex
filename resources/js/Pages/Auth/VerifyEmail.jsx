import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { MailCheck, Send, LogOut } from 'lucide-react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post('/email/verification-notification');
    };

    return (
        <div className="bg-v-black min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans">
            <Head title="Verify Identity | Vortex" />
            
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-v-success opacity-[0.03] blur-[120px] rounded-full" />

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-[480px] z-10"
            >
                <div className="bg-v-glass border border-v-gray-800 rounded-2xl p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] text-center">
                    <div className="w-20 h-20 bg-v-gray-900 border border-v-gray-800 rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-inner">
                        <MailCheck className="text-v-success w-10 h-10" strokeWidth={1.5} />
                    </div>

                    <h1 className="text-3xl font-bold tracking-tighter text-white uppercase mb-4">Validate Protocol</h1>
                    
                    <p className="text-v-gray-400 text-sm leading-relaxed mb-8">
                        Operational identity detected but not validated. Please check your transmission logs (email) for the verification link. If you didn't receive the handshake, we can resend it.
                    </p>

                    {status === 'verification-link-sent' && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8 p-4 bg-v-success/10 border border-v-success/20 rounded-xl text-v-success text-xs font-bold"
                        >
                            NEW VERIFICATION LINK TRANSMITTED SUCCESSFULLY.
                        </motion.div>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="group w-full bg-white hover:bg-v-success text-v-black font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg active:scale-95 disabled:opacity-50"
                        >
                            <Send size={18} className={processing ? "animate-pulse" : "group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"} />
                            {processing ? 'TRANSMITTING...' : 'RESEND VERIFICATION LINK'}
                        </button>

                        <div className="pt-6 flex items-center justify-center gap-6">
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="text-xs text-v-gray-500 hover:text-v-danger transition-colors flex items-center gap-2 font-bold uppercase tracking-widest"
                            >
                                <LogOut size={14} />
                                Abort Mission
                            </Link>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
