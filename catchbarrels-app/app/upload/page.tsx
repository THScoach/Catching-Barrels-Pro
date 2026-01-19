'use client';

import { useState } from 'react';

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setResult(null);
        }
    };

    const handleAnalyze = async () => {
        if (!file) return;

        setAnalyzing(true);
        const formData = new FormData();
        formData.append('video', file);

        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            setResult(data);
        } catch (error) {
            console.error('Analysis failed:', error);
            alert('Analysis failed. Please try again.');
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8 flex flex-col items-center">
            <h1 className="text-4xl font-bold text-mustard-400 mb-2">Video Analyzer</h1>
            <p className="text-slate-400 mb-12">Upload a swing video to get instant biomechanics scores.</p>

            <div className="w-full max-w-md bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl">

                {/* Upload Area */}
                <div className="mb-8">
                    <label className="block text-sm font-bold text-slate-300 mb-2">Select Video</label>
                    <div className="relative border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-mustard-500 transition-colors bg-slate-900/50">
                        <input
                            type="file"
                            accept="video/*"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        {file ? (
                            <div className="text-mustard-400 font-bold">{file.name}</div>
                        ) : (
                            <div className="text-slate-500">
                                <span className="text-2xl block mb-2">📹</span>
                                Drag & drop or click to upload
                            </div>
                        )}
                    </div>
                </div>

                {/* Analyze Button */}
                <button
                    onClick={handleAnalyze}
                    disabled={!file || analyzing}
                    className="w-full bg-mustard-500 hover:bg-mustard-400 text-black font-bold py-4 rounded-xl text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                    {analyzing ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Analyzing Physics...
                        </>
                    ) : (
                        'Analyze Swing ⚡'
                    )}
                </button>
            </div>

            {/* Results */}
            {result && (
                <div className="w-full max-w-4xl mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                    {/* Anchor Score */}
                    <div className="bg-slate-800 p-6 rounded-xl border border-blue-500/30 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">⚓</div>
                        <h3 className="text-blue-400 font-bold uppercase tracking-wider text-sm mb-2">Anchor Score</h3>
                        <div className="text-5xl font-bold text-white mb-2">{result.scores.anchor}</div>
                        <p className="text-slate-400 text-sm">Lower body stability and ground connection.</p>
                    </div>

                    {/* Core Score */}
                    <div className="bg-slate-800 p-6 rounded-xl border border-green-500/30 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">🌪️</div>
                        <h3 className="text-green-400 font-bold uppercase tracking-wider text-sm mb-2">Core Score</h3>
                        <div className="text-5xl font-bold text-white mb-2">{result.scores.core}</div>
                        <p className="text-slate-400 text-sm">Rotational velocity and sequence efficiency.</p>
                    </div>

                    {/* Whip Score */}
                    <div className="bg-slate-800 p-6 rounded-xl border border-red-500/30 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">🏏</div>
                        <h3 className="text-red-400 font-bold uppercase tracking-wider text-sm mb-2">Whip Score</h3>
                        <div className="text-5xl font-bold text-white mb-2">{result.scores.whip}</div>
                        <p className="text-slate-400 text-sm">Bat speed generation and release.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
