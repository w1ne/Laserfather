import React from "react";

interface LoadingSpinnerProps {
    size?: "small" | "medium" | "large";
    message?: string;
}

const SIZES = {
    small: 16,
    medium: 32,
    large: 48
};

export function LoadingSpinner({ size = "medium", message }: LoadingSpinnerProps) {
    const spinnerSize = SIZES[size];

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px"
            }}
        >
            <div
                style={{
                    width: `${spinnerSize}px`,
                    height: `${spinnerSize}px`,
                    border: `${Math.max(2, spinnerSize / 8)}px solid #e5e7eb`,
                    borderTop: `${Math.max(2, spinnerSize / 8)}px solid #3b82f6`,
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite"
                }}
            />
            {message && (
                <div style={{ fontSize: "13px", color: "#666", fontWeight: "500" }}>
                    {message}
                </div>
            )}
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
