import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LoadingSpinner } from "./LoadingSpinner";

describe("LoadingSpinner", () => {
    it("should render with default medium size", () => {
        const { container } = render(<LoadingSpinner />);

        const spinner = container.querySelector("div")?.firstChild as HTMLElement;
        expect(spinner).toBeTruthy();
        expect(spinner.style.width).toBe("32px");
        expect(spinner.style.height).toBe("32px");
    });

    it("should render with small size", () => {
        const { container } = render(<LoadingSpinner size="small" />);

        const spinner = container.querySelector("div")?.firstChild as HTMLElement;
        expect(spinner.style.width).toBe("16px");
        expect(spinner.style.height).toBe("16px");
    });

    it("should render with large size", () => {
        const { container } = render(<LoadingSpinner size="large" />);

        const spinner = container.querySelector("div")?.firstChild as HTMLElement;
        expect(spinner.style.width).toBe("48px");
        expect(spinner.style.height).toBe("48px");
    });

    it("should render with message", () => {
        render(<LoadingSpinner message="Loading..." />);

        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("should not render message when not provided", () => {
        render(<LoadingSpinner />);

        // Should not have any text content except the CSS animation
        expect(screen.queryByText(/./)).not.toBeInTheDocument();
    });

    it("should have spin animation", () => {
        const { container } = render(<LoadingSpinner />);

        const spinner = container.querySelector("div")?.firstChild as HTMLElement;
        expect(spinner.style.animation).toContain("spin");
    });
});
