import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { ShieldAlert, ShieldCheck, QrCode, Key, Trash2 } from 'lucide-react';
import axios from 'axios';

export default function TwoFactorAuthenticationForm({ user }) {
    const [enabling, setEnabling] = useState(false);
    const [qrCode, setQrCode] = useState(null);
    const [recoveryCodes, setRecoveryCodes] = useState([]);
    const [confirmationCode, setConfirmationCode] = useState('');

    const enableTwoFactorAuthentication = () => {
        setEnabling(true);
        router.post('/user/two-factor-authentication', {}, {
            preserveScroll: true,
            onSuccess: () => Promise.all([
                showQrCode(),
                showRecoveryCodes(),
            ]),
            onFinish: () => setEnabling(false),
        });
    };

    const showQrCode = () => {
        return axios.get('/user/two-factor-qr-code').then(response => {
            setQrCode(response.data.svg);
        });
    };

    const showRecoveryCodes = () => {
        return axios.get('/user/two-factor-recovery-codes').then(response => {
            setRecoveryCodes(response.data);
        });
    };

    const confirmTwoFactorAuthentication = () => {
        router.post('/user/confirmed-two-factor-authentication', {
            code: confirmationCode,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setQrCode(null);
                setConfirmationCode('');
            },
        });
    };

    const disableTwoFactorAuthentication = () => {
        router.delete('/user/two-factor-authentication', {
            preserveScroll: true,
        });
    };

    return (
        <div className="bg-v-glass border border-v-gray-800 rounded-2xl p-8 shadow-xl">
            <div className="flex items-start justify-between mb-8">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                        <ShieldAlert className={user.two_factor_enabled ? "text-v-success" : "text-v-warning"} size={24} />
                        Security Gateway
                    </h3>
                    <p className="text-v-gray-500 text-sm mt-2">
                        Multi-factor authentication (MFA) adds an extra layer of defense to your operational identity.
                    </p>
                </div>
            </div>

            {user.two_factor_enabled ? (
                <div className="space-y-6">
                    <div className="bg-v-success/10 border border-v-success/20 rounded-xl p-4 flex items-center gap-4">
                        <div className="bg-v-success/20 p-2 rounded-lg">
                            <ShieldCheck className="text-v-success" size={20} />
                        </div>
                        <div className="flex-1">
                            <p className="text-v-success text-xs font-bold uppercase tracking-widest">Shield Active</p>
                            <p className="text-v-gray-300 text-xs">MFA challenge required for all high-privilege operations.</p>
                        </div>
                    </div>
                    
                    {qrCode && (
                        <div className="animate-fade-in space-y-6 bg-v-black/40 p-6 rounded-xl border border-v-gray-800">
                            <div className="flex gap-6">
                                <div className="bg-white p-3 rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.1)] inline-block h-fit" dangerouslySetInnerHTML={{ __html: qrCode }} />
                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                        <QrCode size={16} className="text-v-success" />
                                        Finalize Integration
                                    </h4>
                                    <p className="text-[11px] text-v-gray-500 leading-relaxed max-w-xs">
                                        Scan this code with your TOTP application (e.g., Bitwarden, Google Authenticator) to establish the cryptographical link.
                                    </p>
                                    
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-bold text-v-gray-600 uppercase tracking-wider">Verification Token</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={confirmationCode}
                                                onChange={e => setConfirmationCode(e.target.value)}
                                                className="bg-v-black border border-v-gray-700 rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-v-success transition-colors flex-1 font-mono"
                                                placeholder="000000"
                                            />
                                            <button
                                                onClick={confirmTwoFactorAuthentication}
                                                className="bg-v-success text-v-black px-6 py-2 rounded-lg font-bold text-xs hover:bg-opacity-90 transition-all"
                                            >
                                                CONFIRM
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {recoveryCodes.length > 0 && (
                        <div className="bg-v-black/60 p-6 rounded-xl border border-v-gray-800">
                            <div className="flex items-center gap-2 text-v-warning text-xs font-bold uppercase tracking-widest mb-4">
                                <Key size={14} />
                                Emergency Recovery Protocols
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {recoveryCodes.map(code => (
                                    <div key={code} className="bg-v-gray-900 border border-v-gray-800 px-3 py-2 rounded font-mono text-[10px] text-v-gray-400 text-center tracking-widest">
                                        {code}
                                    </div>
                                ))}
                            </div>
                            <p className="mt-4 text-[10px] text-v-gray-600 italic">
                                Store these codes in a physical or offline vault. They are required if you lose access to your TOTP device.
                            </p>
                        </div>
                    )}

                    <div className="pt-4 border-t border-v-gray-800 flex justify-end">
                        <button
                            onClick={disableTwoFactorAuthentication}
                            className="flex items-center gap-2 bg-v-danger/10 hover:bg-v-danger/20 text-v-danger border border-v-danger/20 px-5 py-2.5 rounded-xl font-bold text-xs transition-all"
                        >
                            <Trash2 size={14} />
                            TERMINATE MFA SHIELD
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center py-10 bg-v-black/20 rounded-2xl border border-dashed border-v-gray-800">
                    <ShieldAlert size={48} className="text-v-gray-800 mb-4" />
                    <p className="text-v-gray-500 text-xs mb-6 text-center max-w-xs leading-relaxed">
                        Your identity is currently protected by a single factor. Upgrade security to prevent unauthorized access.
                    </p>
                    <button
                        onClick={enableTwoFactorAuthentication}
                        disabled={enabling}
                        className="bg-white hover:bg-v-success text-v-black px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95 disabled:opacity-50"
                    >
                        {enabling ? 'PREPARING PROTOCOLS...' : 'UPGRADE TO MULTI-FACTOR'}
                    </button>
                </div>
            )}
        </div>
    );
}
