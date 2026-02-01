import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useToast } from "./useToast";

describe("useToast", () => {
    it("should initialize with empty toasts", () => {
        const { result } = renderHook(() => useToast());

        expect(result.current.toasts).toEqual([]);
    });

    it("should add a success toast", () => {
        const { result } = renderHook(() => useToast());

        act(() => {
            result.current.success("Success message");
        });

        expect(result.current.toasts).toHaveLength(1);
        expect(result.current.toasts[0].type).toBe("success");
        expect(result.current.toasts[0].message).toBe("Success message");
    });

    it("should add an error toast with longer duration", () => {
        const { result } = renderHook(() => useToast());

        act(() => {
            result.current.error("Error message");
        });

        expect(result.current.toasts).toHaveLength(1);
        expect(result.current.toasts[0].type).toBe("error");
        expect(result.current.toasts[0].message).toBe("Error message");
        expect(result.current.toasts[0].duration).toBe(5000);
    });

    it("should add multiple toasts", () => {
        const { result } = renderHook(() => useToast());

        act(() => {
            result.current.success("Toast 1");
            result.current.error("Toast 2");
            result.current.info("Toast 3");
        });

        expect(result.current.toasts).toHaveLength(3);
    });

    it("should dismiss a specific toast", () => {
        const { result } = renderHook(() => useToast());

        act(() => {
            result.current.success("Toast 1");
            result.current.success("Toast 2");
        });

        const toastId = result.current.toasts[0].id;

        act(() => {
            result.current.dismissToast(toastId);
        });

        expect(result.current.toasts).toHaveLength(1);
        expect(result.current.toasts[0].message).toBe("Toast 2");
    });

    it("should add info toast", () => {
        const { result } = renderHook(() => useToast());

        act(() => {
            result.current.info("Info message");
        });

        expect(result.current.toasts).toHaveLength(1);
        expect(result.current.toasts[0].type).toBe("info");
    });

    it("should add warning toast", () => {
        const { result } = renderHook(() => useToast());

        act(() => {
            result.current.warning("Warning message");
        });

        expect(result.current.toasts).toHaveLength(1);
        expect(result.current.toasts[0].type).toBe("warning");
    });

    it("should use showToast with custom duration", () => {
        const { result } = renderHook(() => useToast());

        act(() => {
            result.current.showToast("success", "Custom duration", 10000);
        });

        expect(result.current.toasts[0].duration).toBe(10000);
    });

    it("should generate unique IDs for toasts", () => {
        const { result } = renderHook(() => useToast());

        act(() => {
            result.current.success("Toast 1");
            result.current.success("Toast 2");
        });

        const ids = result.current.toasts.map(t => t.id);
        expect(new Set(ids).size).toBe(2); // All unique
    });
});
