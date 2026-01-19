'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Props {
    profileCompletedAt: Date | string | null;
    userId: string;
}

export function ProfileUpdateBanner({ profileCompletedAt, userId }: Props) {
    const [showBanner, setShowBanner] = useState(false);
    const [severity, setSeverity] = useState<'info' | 'warning' | 'error'>('info');

    useEffect(() => {
        if (!profileCompletedAt) return;

        const completedDate = new Date(profileCompletedAt);
        const daysSinceUpdate = Math.floor(
            (Date.now() - completedDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        // 180 days = 6 months
        if (daysSinceUpdate >= 180 && daysSinceUpdate < 187) {
            setShowBanner(true);
            setSeverity('info');
        } else if (daysSinceUpdate >= 187 && daysSinceUpdate < 194) {
            setShowBanner(true);
            setSeverity('warning');
        } else if (daysSinceUpdate >= 194) {
            setShowBanner(true);
            setSeverity('error');
        }
    }, [profileCompletedAt]);

    if (!showBanner) return null;

    const severityStyles = {
        info: 'bg-blue-900/50 border-blue-500 text-blue-200',
        warning: 'bg-yellow-900/50 border-yellow-500 text-yellow-200',
        error: 'bg-red-900/50 border-red-500 text-red-200',
    };

    const messages = {
        info: "It's been 6 months! Time to update your profile with your latest height and weight.",
        warning: "Please update your profile soon. Your measurements help us provide accurate analysis.",
        error: "Profile update required! You cannot run new analysis until you update your profile.",
    };

    return (
        <div className={`p-4 border-l-4 mb-6 rounded-r-lg ${severityStyles[severity]}`}>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-semibold mb-1">Profile Update Needed</h3>
                    <p className="text-sm">{messages[severity]}</p>
                </div>
                <Link
                    href="/complete-profile"
                    className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700 text-sm font-medium transition-colors text-white"
                >
                    Update Now
                </Link>
            </div>
        </div>
    );
}
