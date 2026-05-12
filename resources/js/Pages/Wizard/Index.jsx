import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ShieldCheck, 
    ChevronRight, 
    ChevronLeft, 
    Activity, 
    Database, 
    CheckCircle2,
    Lock
} from 'lucide-react';
import Introduction from './Introduction';
import ProviderForm from './ProviderForm';
import ValidationHandshake from './ValidationHandshake';

export default function Index({ auth }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        provider_type: 'proxmox',
        name: '',
        url: '',
        token_id: '',
        token_secret: '',
    });

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const steps = [
        { id: 1, title: 'Identity', icon: Lock },
        { id: 2, title: 'Configuration', icon: Database },
        { id: 3, title: 'Validation', icon: Activity },
    ];

    return (
        <div className="min-h-screen bg-v-black text-white font-sans selection:bg-v-success selection:text-v-black">
            <Head title="Connection Wizard | Vortex" />

            <div className="max-w-4xl mx-auto pt-16 pb-20 px-6">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-between items-center mb-12"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-v-ebony border border-v-gray-800 rounded-xl flex items-center justify-center shadow-glow-success">
                            <ShieldCheck className="text-v-success w-7 h-7" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">CONNECTION WIZARD</h1>
                            <p className="text-v-gray-500 text-xs font-mono uppercase tracking-widest mt-1">Establishing Secure Handshake</p>
                        </div>
                    </div>
                    <Link 
                        href="/dashboard"
                        className="text-v-gray-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-2"
                    >
                        Abort Mission
                    </Link>
                </motion.div>

                {/* Progress Bar */}
                <div className="flex justify-between items-center mb-16 relative">
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-v-gray-900 -z-10" />
                    {steps.map((s) => (
                        <div key={s.id} className="flex flex-col items-center gap-3">
                            <div className={`
                                w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-500
                                ${step >= s.id 
                                    ? 'bg-v-success border-v-success text-v-black shadow-glow-success' 
                                    : 'bg-v-ebony border-v-gray-800 text-v-gray-600'
                                }
                            `}>
                                <s.icon size={18} />
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${step >= s.id ? 'text-v-success' : 'text-v-gray-600'}`}>
                                {s.title}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="bg-v-glass border border-v-gray-800 rounded-3xl p-8 md:p-12 min-h-[400px] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Activity size={200} className="text-v-success" />
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {step === 1 && <Introduction onNext={nextStep} />}
                            {step === 2 && (
                                <ProviderForm 
                                    data={formData} 
                                    setData={setFormData} 
                                    onBack={prevStep} 
                                    onNext={nextStep} 
                                />
                            )}
                            {step === 3 && (
                                <ValidationHandshake 
                                    data={formData} 
                                    onBack={prevStep} 
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
