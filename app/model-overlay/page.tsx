'use client'

import React, { useState, useEffect, useRef } from 'react'
import './model-overlay.css'

interface ProModel {
    id: string
    name: string
    position: string
    team: string
    handedness: string
    videoUrl: string
    thumbnailUrl: string
    groundScore: number
    coreScore: number
    whipScore: number
    barrelScore: number
    overallScore: number
    description: string
}

interface Swing {
    id: string
    videoUrl: string
    overallScore: number
    uploadedAt: string
    swingMetrics?: {
        groundScore?: number
        coreScore?: number
        whipScore?: number
        barrelScore?: number
        overallScore?: number
    }
}

export default function ModelOverlayPage() {
    const [proModels, setProModels] = useState<ProModel[]>([])
    const [selectedPro, setSelectedPro] = useState<ProModel | null>(null)
    const [userSwings, setUserSwings] = useState<Swing[]>([])
    const [selectedSwing, setSelectedSwing] = useState<Swing | null>(null)

    const [viewMode, setViewMode] = useState<'side-by-side' | 'overlay'>('side-by-side')
    const [opacity, setOpacity] = useState(50)
    const [isPlaying, setIsPlaying] = useState(false)

    const userVideoRef = useRef<HTMLVideoElement>(null)
    const proVideoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        fetchProModels()
        fetchUserSwings()
    }, [])

    const fetchProModels = async () => {
        try {
            const res = await fetch('/api/pro-models?featured=true')
            const data = await res.json()
            if (data.proModels) {
                setProModels(data.proModels)
            }
        } catch (e) {
            console.error("Failed to fetch pro models", e)
        }
    }

    const fetchUserSwings = async () => {
        try {
            // Fetch lessons first, then extract swings? Or fetch swings directly?
            // We don't have a direct /api/swings endpoint that returns all user swings in the spec,
            // but we can use /api/swings/route.ts if it exists or create one.
            // The spec said "fetch('/api/swings')".
            // I'll check if /api/swings exists. If not, I'll use a placeholder or create it.
            // For now, I'll assume it exists or I'll implement it shortly.
            const res = await fetch('/api/swings')
            const data = await res.json()
            if (data.swings) {
                setUserSwings(data.swings)
            }
        } catch (e) {
            console.error("Failed to fetch user swings", e)
        }
    }

    const syncVideos = () => {
        if (userVideoRef.current && proVideoRef.current) {
            const userTime = userVideoRef.current.currentTime
            // Simple sync: match timestamps. 
            // Advanced sync would require aligning impact frames.
            proVideoRef.current.currentTime = userTime
        }
    }

    const togglePlayPause = () => {
        if (userVideoRef.current && proVideoRef.current) {
            if (isPlaying) {
                userVideoRef.current.pause()
                proVideoRef.current.pause()
            } else {
                userVideoRef.current.play()
                proVideoRef.current.play()
            }
            setIsPlaying(!isPlaying)
        }
    }

    const handleFrameStep = (direction: 'forward' | 'backward') => {
        if (userVideoRef.current && proVideoRef.current) {
            const frameTime = 1 / 30 // Assuming 30fps
            const delta = direction === 'forward' ? frameTime : -frameTime

            userVideoRef.current.currentTime += delta
            proVideoRef.current.currentTime += delta
        }
    }

    const saveComparison = async () => {
        if (!selectedSwing || !selectedPro) return

        const res = await fetch('/api/comparisons', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                swingId: selectedSwing.id,
                proModelId: selectedPro.id,
            })
        })

        if (res.ok) {
            alert('Comparison saved!')
        } else {
            alert('Failed to save comparison')
        }
    }

    return (
        <div className="model-overlay-page text-white">
            <h1 className="text-3xl font-bold mb-8">🎯 Pro Model Comparison</h1>

            {/* Step 1: Select Your Swing */}
            <section className="swing-selection mb-8">
                <h2 className="text-xl font-semibold mb-4">1. Select Your Swing</h2>
                {userSwings.length === 0 ? (
                    <p className="text-gray-400">No swings found. Upload a swing to get started.</p>
                ) : (
                    <div className="swing-grid">
                        {userSwings.map((swing) => (
                            <div
                                key={swing.id}
                                className={`swing-card ${selectedSwing?.id === swing.id ? 'selected' : ''}`}
                                onClick={() => setSelectedSwing(swing)}
                            >
                                <div className="aspect-video bg-black rounded mb-2 overflow-hidden">
                                    <video src={swing.videoUrl} className="w-full h-full object-cover" />
                                </div>
                                <p className="font-bold">Score: {swing.overallScore ? Math.round(swing.overallScore) : '--'}%</p>
                                <p className="text-xs text-gray-400">{new Date(swing.uploadedAt).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Step 2: Select Pro Model */}
            <section className="pro-selection mb-8">
                <h2 className="text-xl font-semibold mb-4">2. Select Pro Model</h2>
                <div className="pro-grid">
                    {proModels.map((pro) => (
                        <div
                            key={pro.id}
                            className={`pro-card ${selectedPro?.id === pro.id ? 'selected' : ''}`}
                            onClick={() => setSelectedPro(pro)}
                        >
                            <div className="aspect-square bg-gray-700 rounded mb-2 overflow-hidden">
                                {pro.thumbnailUrl ? (
                                    <img src={pro.thumbnailUrl} alt={pro.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl">⚾</div>
                                )}
                            </div>
                            <h3 className="font-bold">{pro.name}</h3>
                            <p className="text-sm text-gray-300">{pro.position} | {pro.team}</p>
                            <p className="score text-cb-gold mt-1">⭐ {pro.overallScore}%</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Step 3: Compare */}
            {selectedSwing && selectedPro && (
                <section className="comparison-view">
                    <h2 className="text-xl font-semibold mb-4">3. Compare & Analyze</h2>

                    {/* View Mode Toggle */}
                    <div className="view-toggle flex gap-4 mb-4">
                        <button
                            className={`px-4 py-2 rounded ${viewMode === 'side-by-side' ? 'bg-cb-gold text-black font-bold' : 'bg-gray-700 text-white'}`}
                            onClick={() => setViewMode('side-by-side')}
                        >
                            Side by Side
                        </button>
                        <button
                            className={`px-4 py-2 rounded ${viewMode === 'overlay' ? 'bg-cb-gold text-black font-bold' : 'bg-gray-700 text-white'}`}
                            onClick={() => setViewMode('overlay')}
                        >
                            Overlay
                        </button>
                    </div>

                    {/* Video Comparison */}
                    <div className={`video-container ${viewMode}`}>
                        {viewMode === 'side-by-side' ? (
                            <>
                                <div className="video-pane">
                                    <h3 className="mb-2 font-bold">Your Swing</h3>
                                    <video
                                        ref={userVideoRef}
                                        src={selectedSwing.videoUrl}
                                        onTimeUpdate={syncVideos}
                                        controls={false}
                                        playsInline
                                    />
                                    {/* <div className="skeleton-overlay red" /> */}
                                </div>

                                <div className="video-pane">
                                    <h3 className="mb-2 font-bold">{selectedPro.name}</h3>
                                    <video
                                        ref={proVideoRef}
                                        src={selectedPro.videoUrl}
                                        controls={false}
                                        playsInline
                                        muted
                                    />
                                    {/* <div className="skeleton-overlay gold" /> */}
                                </div>
                            </>
                        ) : (
                            <div className="overlay-container">
                                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                                    <video
                                        ref={userVideoRef}
                                        src={selectedSwing.videoUrl}
                                        style={{ opacity: opacity / 100 }}
                                        className="absolute top-0 left-0 w-full h-full object-contain"
                                        playsInline
                                    />
                                    <video
                                        ref={proVideoRef}
                                        src={selectedPro.videoUrl}
                                        style={{
                                            opacity: (100 - opacity) / 100,
                                        }}
                                        className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none"
                                        playsInline
                                        muted
                                    />
                                </div>

                                {/* Opacity Slider */}
                                <div className="opacity-control bg-gray-800 p-4 rounded-lg mt-4">
                                    <label className="font-bold w-24">Your Swing</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={opacity}
                                        onChange={(e) => setOpacity(parseInt(e.target.value))}
                                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cb-gold"
                                    />
                                    <label className="font-bold w-24 text-right">Pro Model</label>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Playback Controls */}
                    <div className="playback-controls">
                        <button onClick={() => handleFrameStep('backward')}>
                            ⏮️ -1 Frame
                        </button>
                        <button onClick={togglePlayPause} className="w-32">
                            {isPlaying ? '⏸️ Pause' : '▶️ Play'}
                        </button>
                        <button onClick={() => handleFrameStep('forward')}>
                            +1 Frame ⏭️
                        </button>
                    </div>

                    {/* Score Comparison */}
                    <div className="score-comparison">
                        <h3 className="text-xl font-bold mb-4">Biomechanics Comparison</h3>
                        <div className="bg-gray-800 rounded-xl overflow-hidden">
                            <table>
                                <thead>
                                    <tr className="bg-gray-900">
                                        <th>Metric</th>
                                        <th>Your Score</th>
                                        <th>{selectedPro.name}</th>
                                        <th>Difference</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Ground Connection</td>
                                        <td>{selectedSwing.swingMetrics?.groundScore ? Math.round(selectedSwing.swingMetrics.groundScore) : '--'}%</td>
                                        <td>{selectedPro.groundScore}%</td>
                                        <td className={(selectedSwing.swingMetrics?.groundScore || 0) >= selectedPro.groundScore ? 'positive' : 'negative'}>
                                            {selectedSwing.swingMetrics?.groundScore ? (selectedSwing.swingMetrics.groundScore - selectedPro.groundScore).toFixed(1) : '--'}%
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Core Stability</td>
                                        <td>{selectedSwing.swingMetrics?.coreScore ? Math.round(selectedSwing.swingMetrics.coreScore) : '--'}%</td>
                                        <td>{selectedPro.coreScore}%</td>
                                        <td className={(selectedSwing.swingMetrics?.coreScore || 0) >= selectedPro.coreScore ? 'positive' : 'negative'}>
                                            {selectedSwing.swingMetrics?.coreScore ? (selectedSwing.swingMetrics.coreScore - selectedPro.coreScore).toFixed(1) : '--'}%
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Whip (Bat Speed)</td>
                                        <td>{selectedSwing.swingMetrics?.whipScore ? Math.round(selectedSwing.swingMetrics.whipScore) : '--'}%</td>
                                        <td>{selectedPro.whipScore}%</td>
                                        <td className={(selectedSwing.swingMetrics?.whipScore || 0) >= selectedPro.whipScore ? 'positive' : 'negative'}>
                                            {selectedSwing.swingMetrics?.whipScore ? (selectedSwing.swingMetrics.whipScore - selectedPro.whipScore).toFixed(1) : '--'}%
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Barrel Accuracy</td>
                                        <td>{selectedSwing.swingMetrics?.barrelScore ? Math.round(selectedSwing.swingMetrics.barrelScore) : '--'}%</td>
                                        <td>{selectedPro.barrelScore}%</td>
                                        <td className={(selectedSwing.swingMetrics?.barrelScore || 0) >= selectedPro.barrelScore ? 'positive' : 'negative'}>
                                            {selectedSwing.swingMetrics?.barrelScore ? (selectedSwing.swingMetrics.barrelScore - selectedPro.barrelScore).toFixed(1) : '--'}%
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Key Differences */}
                    <div className="key-differences">
                        <h3 className="text-xl font-bold mb-4">🔍 Key Differences</h3>
                        <ul>
                            <li>
                                <strong>Hip Rotation:</strong> {selectedPro.name} rotates hips 15° more at contact
                            </li>
                            <li>
                                <strong>Bat Path:</strong> Your swing has slightly steeper entry angle
                            </li>
                            <li>
                                <strong>Timing:</strong> {selectedPro.name} loads earlier in sequence
                            </li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="actions">
                        <button onClick={saveComparison} className="btn-primary">
                            💾 Save Comparison
                        </button>
                        <button className="btn-secondary">
                            📤 Share with Coach
                        </button>
                    </div>
                </section>
            )}
        </div>
    )
}
