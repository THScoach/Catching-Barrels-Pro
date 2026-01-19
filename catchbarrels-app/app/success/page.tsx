'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const athleteId = searchParams.get('athleteId');

    return (
        <div className="max-w-2xl mx-auto bg-slate-800 rounded-2xl p-10 border border-slate-700 shadow-2xl text-center">
            <div className="text-6xl mb-6">✅</div>
            <h1 className="text-4xl font-bold text-mustard-400 mb-4">Registration Complete!</h1>

            <p className="text-xl text-slate-300 mb-8">
                Your player has been successfully registered for the Augusta program.
            </p>

            <div className="bg-slate-900 rounded-xl p-6 text-left mb-8 border border-slate-800">
                <h2 className="text-lg font-bold text-white mb-4">Next Steps:</h2>
                <ol className="list-decimal list-inside space-y-3 text-slate-400">
                    <li>Check your email for confirmation details.</li>
                    <li>Payment information will be sent separately.</li>
                    <li>You'll receive login credentials within 24 hours.</li>
                </ol>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-center">
                <button
                    onClick={() => router.push('/register/augusta')}
                    className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                    Register Another Player
                </button>
                <button
                    onClick={() => router.push('/')}
                    className="bg-mustard-500 hover:bg-mustard-400 text-black font-bold py-3 px-6 rounded-lg transition-colors"
                >
                    Return to Home
                </button>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <div className="min-h-screen bg-slate-900 text-white p-4 md:p-8 flex items-center justify-center">
            <Suspense fallback={<div className="text-white">Loading...</div>}>
                <SuccessContent />
            </Suspense>
        </div>
    );
}
