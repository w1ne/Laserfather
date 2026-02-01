import { describe, it, expect } from "vitest";
import { getPathCentroid, distance, optimizePaths, calculateTotalTravel } from "./pathOptimizer";
import type { PolylinePath } from "./model";

describe("pathOptimizer", () => {
    describe("getPathCentroid", () => {
        it("should calculate centroid of a simple path", () => {
            const path: PolylinePath = {
                points: [
                    { x: 0, y: 0 },
                    { x: 10, y: 0 },
                    { x: 10, y: 10 },
                    { x: 0, y: 10 }
                ],
                closed: false
            };

            const centroid = getPathCentroid(path);
            expect(centroid.x).toBe(5);
            expect(centroid.y).toBe(5);
        });

        it("should handle empty path", () => {
            const path: PolylinePath = { points: [], closed: false };
            const centroid = getPathCentroid(path);
            expect(centroid).toEqual({ x: 0, y: 0 });
        });

        it("should handle single point", () => {
            const path: PolylinePath = { points: [{ x: 5, y: 10 }], closed: false };
            const centroid = getPathCentroid(path);
            expect(centroid).toEqual({ x: 5, y: 10 });
        });
    });

    describe("distance", () => {
        it("should calculate distance between two points", () => {
            const a = { x: 0, y: 0 };
            const b = { x: 3, y: 4 };
            expect(distance(a, b)).toBe(5); // 3-4-5 triangle
        });

        it("should return 0 for same point", () => {
            const a = { x: 5, y: 5 };
            expect(distance(a, a)).toBe(0);
        });

        it("should handle negative coordinates", () => {
            const a = { x: -3, y: -4 };
            const b = { x: 0, y: 0 };
            expect(distance(a, b)).toBe(5);
        });
    });

    describe("optimizePaths", () => {
        it("should return empty array for empty input", () => {
            const result = optimizePaths([]);
            expect(result).toEqual([]);
        });

        it("should return single path unchanged", () => {
            const paths: PolylinePath[] = [
                { points: [{ x: 0, y: 0 }, { x: 10, y: 10 }], closed: false }
            ];
            const result = optimizePaths(paths);
            expect(result).toEqual(paths);
        });

        it("should optimize simple 3-path scenario", () => {
            // Path A: bottom-left (0,0 to 10,10)
            // Path B: top-right (90,90 to 100,100)
            // Path C: middle (40,40 to 50,50)
            // Optimal order: A -> C -> B
            const paths: PolylinePath[] = [
                { points: [{ x: 0, y: 0 }, { x: 10, y: 10 }], closed: false },      // A
                { points: [{ x: 90, y: 90 }, { x: 100, y: 100 }], closed: false },  // B
                { points: [{ x: 40, y: 40 }, { x: 50, y: 50 }], closed: false }     // C
            ];

            const result = optimizePaths(paths);

            // Should start with A (closest to origin)
            expect(result[0]).toBe(paths[0]);
            // Then C (middle)
            expect(result[1]).toBe(paths[2]);
            // Then B (far)
            expect(result[2]).toBe(paths[1]);
        });

        it("should reduce total travel distance", () => {
            const paths: PolylinePath[] = [
                { points: [{ x: 0, y: 0 }, { x: 10, y: 0 }], closed: false },
                { points: [{ x: 100, y: 0 }, { x: 110, y: 0 }], closed: false },
                { points: [{ x: 50, y: 0 }, { x: 60, y: 0 }], closed: false }
            ];

            const originalDistance = calculateTotalTravel(paths);
            const optimized = optimizePaths(paths);
            const optimizedDistance = calculateTotalTravel(optimized);

            expect(optimizedDistance).toBeLessThan(originalDistance);
        });
    });

    describe("calculateTotalTravel", () => {
        it("should return 0 for empty paths", () => {
            expect(calculateTotalTravel([])).toBe(0);
        });

        it("should calculate distance from origin to single path", () => {
            const paths: PolylinePath[] = [
                { points: [{ x: 3, y: 4 }, { x: 10, y: 10 }], closed: false }
            ];
            const total = calculateTotalTravel(paths);
            expect(total).toBe(5); // Distance from origin to (3,4)
        });

        it("should calculate total travel for multiple paths", () => {
            const paths: PolylinePath[] = [
                { points: [{ x: 0, y: 0 }, { x: 10, y: 0 }], closed: false },
                { points: [{ x: 20, y: 0 }, { x: 30, y: 0 }], closed: false }
            ];
            const total = calculateTotalTravel(paths);
            // Origin to (0,0) = 0
            // (10,0) to (20,0) = 10
            // Total = 10
            expect(total).toBe(10);
        });
    });

    describe("integration: realistic scenario", () => {
        it("should optimize a grid of rectangles", () => {
            // Create a 3x3 grid of small rectangles
            const paths: PolylinePath[] = [];
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    const x = col * 30;
                    const y = row * 30;
                    paths.push({
                        points: [
                            { x, y },
                            { x: x + 10, y },
                            { x: x + 10, y: y + 10 },
                            { x, y: y + 10 },
                            { x, y }
                        ]
                    });
                }
            }

            const originalDistance = calculateTotalTravel(paths);
            const optimized = optimizePaths(paths);
            const optimizedDistance = calculateTotalTravel(optimized);

            // Should achieve at least 20% reduction
            const reduction = (originalDistance - optimizedDistance) / originalDistance;
            expect(reduction).toBeGreaterThan(0.2);
        });
    });
});
