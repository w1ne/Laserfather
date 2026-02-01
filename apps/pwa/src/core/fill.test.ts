import { describe, it, expect } from "vitest";
import { vectorFill } from "./fill";
import { PolylinePath } from "./model";

describe("vectorFill", () => {
    it("should fill a simple rectangle at 0 degrees", () => {
        const polyline: PolylinePath = {
            closed: true,
            points: [
                { x: 0, y: 0 },
                { x: 10, y: 0 },
                { x: 10, y: 10 },
                { x: 0, y: 10 }
            ]
        };

        const result = vectorFill([polyline], 1, 0);

        // y=0.5 to y=9.5 inclusive = 10 lines
        expect(result.length).toBe(10);

        // Check first line (y=0.5)
        expect(result[0].points[0]).toMatchObject({ x: 0, y: 0.5 });
        expect(result[0].points[1]).toMatchObject({ x: 10, y: 0.5 });
    });

    it("should fill a rectangle at 45 degrees", () => {
        const polyline: PolylinePath = {
            closed: true,
            points: [
                { x: 0, y: 0 },
                { x: 10, y: 0 },
                { x: 10, y: 10 },
                { x: 0, y: 10 }
            ]
        };

        const result = vectorFill([polyline], 1, 45);
        // Bounds in 45 deg space: minY=0, maxY=~14.14
        // Expected ~14 lines
        expect(result.length).toBeGreaterThan(13);
    });

    it("should handle nested shapes (Donut / Hole)", () => {
        // Outer box 0,0 to 10,10
        const outer: PolylinePath = {
            closed: true,
            points: [
                { x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 }
            ]
        };
        // Inner box 2,2 to 8,8
        const inner: PolylinePath = {
            closed: true,
            points: [
                { x: 2, y: 2 }, { x: 8, y: 2 }, { x: 8, y: 8 }, { x: 2, y: 8 }
            ]
        };

        const result = vectorFill([outer, inner], 2, 0);

        // Scanlines at y=1, 3, 5, 7, 9
        // y=1: (0, 10) -> 1 segment
        // y=3: (0, 2) and (8, 10) -> 2 segments
        // y=5: (0, 2) and (8, 10) -> 2 segments
        // y=7: (0, 2) and (8, 10) -> 2 segments
        // y=9: (0, 10) -> 1 segment

        expect(result.length).toBe(8);
        expect(result[0].points[1].x - result[0].points[0].x).toBe(10);
        expect(result[1].points[1].x - result[1].points[0].x).toBe(2);
    });

    it("should handle concave shapes (C-shape)", () => {
        const polyline: PolylinePath = {
            closed: true,
            points: [
                { x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 },
                { x: 0, y: 8 }, { x: 8, y: 8 }, { x: 8, y: 2 }, { x: 0, y: 2 }
            ]
        };

        // y=1: (0, 10)
        // y=3: (8, 10)
        // y=5: (8, 10)
        // y=7: (8, 10)
        // y=9: (0, 10)
        const result = vectorFill([polyline], 2, 0);
        expect(result.length).toBe(5);
        expect(result[1].points).toMatchObject([{ x: 8, y: 3 }, { x: 10, y: 3 }]);
    });

    it("should return empty for invalid geometry", () => {
        const unclosed: PolylinePath = {
            closed: false,
            points: [{ x: 0, y: 0 }, { x: 10, y: 0 }]
        };
        expect(vectorFill([unclosed], 1, 0)).toEqual([]);
    });
});
