export interface NormalizedDataPoint {
    normalizedTime: number; // 0 to 1
    value: number;
    originalIndex?: number;
}

/**
 * Normalizes a time series to a 0-1 time scale based on key events.
 * If key events are not provided, normalizes the entire series.
 */
export function normalizeTimeSeries(
    data: number[],
    startIndex: number = 0,
    endIndex: number = data.length - 1
): NormalizedDataPoint[] {
    const totalFrames = endIndex - startIndex;
    if (totalFrames <= 0) return [];

    const normalized: NormalizedDataPoint[] = [];

    for (let i = startIndex; i <= endIndex; i++) {
        if (i >= 0 && i < data.length) {
            normalized.push({
                normalizedTime: (i - startIndex) / totalFrames,
                value: data[i],
                originalIndex: i
            });
        }
    }

    return normalized;
}

/**
 * Resamples normalized data to a standard number of points (e.g., 100).
 * Uses linear interpolation.
 */
export function resampleToStandardPoints(
    data: NormalizedDataPoint[],
    standardPoints: number = 100
): number[] {
    if (data.length === 0) return new Array(standardPoints).fill(0);

    const resampled: number[] = [];

    // Create target times: 0.0, 0.01, ..., 0.99, 1.0
    for (let i = 0; i < standardPoints; i++) {
        const targetTime = i / (standardPoints - 1);
        resampled.push(interpolateValue(data, targetTime));
    }

    return resampled;
}

function interpolateValue(data: NormalizedDataPoint[], targetTime: number): number {
    // Handle edge cases
    if (targetTime <= 0) return data[0].value;
    if (targetTime >= 1) return data[data.length - 1].value;

    // Find surrounding points
    // Optimization: Could use binary search for large arrays, but linear scan is fine for < 1000 points
    for (let i = 0; i < data.length - 1; i++) {
        const current = data[i];
        const next = data[i + 1];

        if (current.normalizedTime <= targetTime && next.normalizedTime >= targetTime) {
            // Linear interpolation
            const timeDiff = next.normalizedTime - current.normalizedTime;
            if (timeDiff === 0) return current.value;

            const valueDiff = next.value - current.value;
            const timeOffset = targetTime - current.normalizedTime;

            return current.value + (valueDiff * (timeOffset / timeDiff));
        }
    }

    return data[data.length - 1].value;
}
