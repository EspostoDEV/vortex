import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, AlertCircle, Loader2, Save, ChevronLeft } from 'lucide-react';
import { router } from '@inertiajs/react';
import axios from 'axios';

export default function ValidationHandshake({ data, onBack }) {
    const [status, setStatus] = useState('pending'); // pending, validating, success, error
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const performHandshake = async () => {
            setStatus('validating');
            try {
                const response = await axios.post('/wizard/validate', data);
                if (response.data.success) {
                    setStatus('success');
                } else {
                    setStatus('error');
                    setErrorMessage(response.data.message);
                }
            } catch (err) {
                setStatus('error');
                setErrorMessage(err.response?.data?.message || 'Network error occurred during handshake.');
            }
        };

        performHandshake();
    }, []);

    const saveConnection = async () => {
        try {
            const response = await axios.post('/wizard/save', data);
            if (response.data.success) {
                router.visit('/dashboard');
            }
        } catch (err) {
            setErrorMessage('Failed to persist connection. ' + (err.response?.data?.message || ''));
            setStatus('error');
        }
    };

    return (
        <div className="space-y-12 relative z-10 py-10 flex flex-col items-center text-center">
            <div className="relative">
                <div className={`
                    w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all duration-1000
                    ${status === 'pending' || status === 'validating' ? 'border-v-gray-800 animate-pulse' : ''}
                    ${status === 'success' ? 'border-v-success shadow-glow-success' : ''}
                    ${status === 'error' ? 'border-v-danger shadow-glow-danger' : ''}
                `}>
                    {status === 'pending' && <Activity className="text-v-gray-700 w-10 h-10" />}
                    {status === 'validating' && <Loader2 className="text-v-success w-10 h-10 animate-spin" />}
                    {status === 'success' && <ShieldCheck className="text-v-success w-12 h-12" />}
                    {status === 'error' && <AlertCircle className="text-v-danger w-12 h-12" />}
                </div>
                
                {status === 'validating' && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute -inset-4 border border-v-success/30 rounded-full animate-ping" 
                    />
                )}
            </div>

            <div className="max-w-md">
                <h2 className="text-3xl font-bold tracking-tighter mb-4 uppercase">
                    {status === 'pending' && 'Preparing Handshake'}
                    {status === 'validating' && 'Negotiating Connection'}
                    {status === 'success' && 'Secure Link Established'}
                    {status === 'error' && 'Handshake Failed'}
                </h2>
                <p className="text-v-gray-500 text-sm leading-relaxed font-mono">
                    {status === 'pending' && 'Initializing driver protocols and checking local vault connectivity...'}
                    {status === 'validating' && `Attempting to reach ${data.url} with ${data.token_id}...`}
                    {status === 'success' && 'The remote provider has accepted the cryptographical identity. All systems are go.'}
                    {status === 'error' && (errorMessage || 'The remote API rejected the credentials. Check your token and URL parameters.')}
                </p>
            </div>

            {status === 'success' && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-4 w-full max-w-xs pt-8"
                >
                    <button 
                        onClick={saveConnection}
                        className="bg-v-success text-v-black px-10 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-glow-success active:scale-95"
                    >
                        <Save size={18} />
                        SAVE & INITIALIZE
                    </button>
                    <p className="text-[10px] text-v-gray-600 uppercase tracking-widest font-bold">
                        Persisting credentials to encrypted vault
                    </p>
                </motion.div>
            )}

            {status !== 'success' && status !== 'validating' && (
                <button 
                    onClick={onBack}
                    className="mt-8 text-v-gray-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-2"
                >
                    <ChevronLeft size={16} />
                    Return to Config
                </button>
            )}
        </div>
    );
}
