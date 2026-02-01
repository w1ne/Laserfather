import { describe, it, expect } from "vitest";
import { formatTime, formatDistance, formatNumber } from "./formatters";

describe("formatters", () => {
    describe("formatTime", () => {
        it("should format times less than 1 second", () => {
            expect(formatTime(0)).toBe("< 1s");
            expect(formatTime(0.5)).toBe("< 1s");
            expect(formatTime(0.99)).toBe("< 1s");
        });

        it("should format seconds only", () => {
            expect(formatTime(1)).toBe("1s");
            expect(formatTime(45)).toBe("45s");
            expect(formatTime(59)).toBe("59s");
        });

        it("should format minutes and seconds", () => {
            expect(formatTime(60)).toBe("1m");
            expect(formatTime(65)).toBe("1m 5s");
            expect(formatTime(125)).toBe("2m 5s");
            expect(formatTime(3599)).toBe("59m 59s");
        });

        it("should format hours and minutes", () => {
            expect(formatTime(3600)).toBe("1h");
            expect(formatTime(3660)).toBe("1h 1m");
            expect(formatTime(7265)).toBe("2h 1m");
        });
    });

    describe("formatDistance", () => {
        it("should format small distances", () => {
            expect(formatDistance(0)).toBe("0 mm");
            expect(formatDistance(123.456)).toBe("123 mm");
            expect(formatDistance(999.9)).toBe("1,000 mm");
        });

        it("should format large distances with commas", () => {
            expect(formatDistance(1234.5)).toBe("1,235 mm");
            expect(formatDistance(12345.6)).toBe("12,346 mm");
            expect(formatDistance(123456.7)).toBe("123,457 mm");
        });
    });

    describe("formatNumber", () => {
        it("should format numbers with commas", () => {
            expect(formatNumber(0)).toBe("0");
            expect(formatNumber(123)).toBe("123");
            expect(formatNumber(1234)).toBe("1,234");
            expect(formatNumber(1234567)).toBe("1,234,567");
        });
    });
});
