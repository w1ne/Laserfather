/**
 * Format seconds into a human-readable time string.
 * Examples:
 *   0.5 -> "< 1s"
 *   45 -> "45s"
 *   125 -> "2m 5s"
 *   3665 -> "1h 1m"
 */
export function formatTime(seconds: number): string {
    if (seconds < 1) return "< 1s";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
        return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }

    if (minutes > 0) {
        return secs > 0 ? `${minutes}m ${secs}s` : `${minutes}m`;
    }

    return `${secs}s`;
}

/**
 * Format distance in millimeters with proper units and commas.
 * Examples:
 *   123.456 -> "123 mm"
 *   1234.5 -> "1,235 mm"
 *   12345.6 -> "12,346 mm"
 */
export function formatDistance(mm: number): string {
    const rounded = Math.round(mm);
    return rounded.toLocaleString() + " mm";
}

/**
 * Format a number with commas for readability.
 * Examples:
 *   1234 -> "1,234"
 *   1234567 -> "1,234,567"
 */
export function formatNumber(num: number): string {
    return num.toLocaleString();
}
