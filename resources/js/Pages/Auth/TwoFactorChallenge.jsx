import React, { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ShieldAlert, Key, ArrowRight, RefreshCw } from 'lucide-react';

export default function TwoFactorChallenge() {
    const { data, setData, post, processing, errors } = useForm({
        code: '',
        recovery_code: '',
    });

    const [isRecovery, setIsRecovery] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post('/two-factor-challenge');
    };

    return (
        <div className="bg-v-black min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans">
            <Head title="Identity Verification | Vortex" />
            
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-v-warning opacity-[0.03] blur-[120px] rounded-full" />

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-[440px] z-10"
            >
                <div className="bg-v-glass border border-v-gray-800 rounded-2xl p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-v-warning to-transparent opacity-50" />

                    <div className="flex flex-col items-center mb-10">
                        <div className="w-16 h-16 bg-v-gray-900 border border-v-gray-800 rounded-2xl flex items-center justify-center mb-6">
                            <ShieldAlert className="text-v-warning w-8 h-8" strokeWidth={1.5} />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tighter text-white uppercase">Identity Shield</h1>
                        <p className="text-v-gray-400 text-xs mt-2 text-center uppercase tracking-widest font-bold">
                            {isRecovery ? 'Emergency Recovery Protocol' : 'Multi-Factor Validation'}
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        {!isRecovery ? (
                            <div className="group">
                                <label className="block text-[10px] font-bold text-v-gray-600 uppercase mb-4 text-center tracking-[0.2em]">Authenticator Token</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={data.code}
                                        onChange={e => setData('code', e.target.value)}
                                        className="w-full bg-v-black/50 border border-v-gray-800 rounded-xl px-4 py-5 text-white text-center text-3xl font-mono tracking-[0.3em] focus:border-v-warning outline-none transition-all placeholder:text-v-gray-800"
                                        placeholder="000000"
                                        required
                                        autoFocus
                                    />
                                </div>
                                {errors.code && <p className="text-v-danger text-[11px] mt-2 text-center">{errors.code}</p>}
                            </div>
                        ) : (
                            <div className="group">
                                <label className="block text-[10px] font-bold text-v-gray-600 uppercase mb-2 ml-1 tracking-wider">Recovery Key</label>
                                <div className="relative">
                                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-v-gray-600 group-focus-within:text-v-warning transition-colors" />
                                    <input
                                        type="text"
                                        value={data.recovery_code}
                                        onChange={e => setData('recovery_code', e.target.value)}
                                        className="w-full bg-v-black/50 border border-v-gray-800 rounded-xl pl-12 pr-4 py-4 text-sm text-white focus:border-v-warning outline-none transition-all placeholder:text-v-gray-700"
                                        placeholder="Enter recovery code"
                                        required
                                    />
                                </div>
                                {errors.recovery_code && <p className="text-v-danger text-[11px] mt-2 ml-1">{errors.recovery_code}</p>}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={processing}
                            className="group relative w-full bg-v-warning text-v-black font-bold py-4 rounded-xl transition-all duration-300 shadow-[0_10px_20px_rgba(255,184,0,0.1)] active:scale-[0.98]"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {processing ? 'VALIDATING...' : 'VERIFY IDENTITY'}
                                {!processing && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
                            </span>
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => {
                                setIsRecovery(!isRecovery);
                                setData({ code: '', recovery_code: '' });
                            }}
                            className="flex items-center gap-2 mx-auto text-xs text-v-gray-500 hover:text-white transition-colors"
                        >
                            <RefreshCw size={12} />
                            {isRecovery ? 'Use authenticator code' : 'Use a recovery code'}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
