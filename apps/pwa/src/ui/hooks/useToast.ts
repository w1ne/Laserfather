import { useState, useCallback } from "react";
import { ToastType, ToastProps } from "../components/Toast";

let toastIdCounter = 0;

export function useToast() {
    const [toasts, setToasts] = useState<ToastProps[]>([]);

    const showToast = useCallback((type: ToastType, message: string, duration?: number) => {
        const id = `toast-${++toastIdCounter}`;

        setToasts((prev) => [
            ...prev,
            {
                id,
                type,
                message,
                duration,
                onDismiss: (dismissId) => {
                    setToasts((current) => current.filter((t) => t.id !== dismissId));
                }
            }
        ]);
    }, []);

    const dismissToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return {
        toasts,
        showToast,
        dismissToast,
        success: (message: string, duration?: number) => showToast("success", message, duration),
        error: (message: string, duration?: number) => showToast("error", message, duration || 5000),
        info: (message: string, duration?: number) => showToast("info", message, duration),
        warning: (message: string, duration?: number) => showToast("warning", message, duration)
    };
}
