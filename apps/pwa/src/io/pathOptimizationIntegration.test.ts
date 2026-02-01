import { describe, it, expect } from "vitest";
import { planCam } from "../core/cam";
import { emitGcode } from "../core/gcode";
import type { Document, CamSettings, MachineProfile, GcodeDialect } from "../core/model";

describe("Path Optimization Integration", () => {
    const dialect: GcodeDialect = {
        newline: "\n",
        useG0ForTravel: true,
        powerCommand: "S",
        enableLaser: "M4",
        disableLaser: "M5"
    };

    const machine: MachineProfile = {
        id: "test",
        name: "Test Machine",
        workArea: { width: 300, height: 200 },
        feedRate: 3000,
        travelRate: 6000,
        sRange: { min: 0, max: 1000 }
    };

    it("should reduce travel distance with path optimization enabled", () => {
        // Create a document with 4 paths in a grid pattern
        const doc: Document = {
            version: 1,
            units: "mm",
            layers: [
                { id: "l1", name: "Layer 1", visible: true, locked: false, operationId: "op1" }
            ],
            objects: [
                // Top-left
                {
                    kind: "path",
                    id: "path1",
                    layerId: "l1",
                    transform: { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 },
                    closed: true,
                    points: [{ x: 10, y: 10 }, { x: 30, y: 10 }, { x: 30, y: 30 }, { x: 10, y: 30 }]
                },
                // Bottom-right
                {
                    kind: "path",
                    id: "path2",
                    layerId: "l1",
                    transform: { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 },
                    closed: true,
                    points: [{ x: 100, y: 100 }, { x: 120, y: 100 }, { x: 120, y: 120 }, { x: 100, y: 120 }]
                },
                // Top-right
                {
                    kind: "path",
                    id: "path3",
                    layerId: "l1",
                    transform: { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 },
                    closed: true,
                    points: [{ x: 100, y: 10 }, { x: 120, y: 10 }, { x: 120, y: 30 }, { x: 100, y: 30 }]
                },
                // Bottom-left
                {
                    kind: "path",
                    id: "path4",
                    layerId: "l1",
                    transform: { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 },
                    closed: true,
                    points: [{ x: 10, y: 100 }, { x: 30, y: 100 }, { x: 30, y: 120 }, { x: 10, y: 120 }]
                }
            ]
        };

        const camSettings: CamSettings = {
            operations: [
                { id: "op1", name: "Cut", mode: "line", speed: 500, power: 100, passes: 1 }
            ],
            optimizePaths: true
        };

        const camSettingsNoOptimization: CamSettings = {
            ...camSettings,
            optimizePaths: false
        };

        // Generate G-code with optimization
        const planOptimized = planCam(doc, camSettings);
        const gcodeOptimized = emitGcode(planOptimized.plan, camSettings, machine, dialect);

        // Generate G-code without optimization
        const planUnoptimized = planCam(doc, camSettingsNoOptimization);
        const gcodeUnoptimized = emitGcode(planUnoptimized.plan, camSettingsNoOptimization, machine, dialect);

        // Verify optimization reduces travel distance
        expect(gcodeOptimized.stats.travelMm).toBeLessThan(gcodeUnoptimized.stats.travelMm);

        // Should achieve at least 15% reduction
        const reduction = (gcodeUnoptimized.stats.travelMm - gcodeOptimized.stats.travelMm) / gcodeUnoptimized.stats.travelMm;
        expect(reduction).toBeGreaterThan(0.15);
    });

    it("should maintain same marking distance with optimization", () => {
        const doc: Document = {
            version: 1,
            units: "mm",
            layers: [
                { id: "l1", name: "Layer 1", visible: true, locked: false, operationId: "op1" }
            ],
            objects: [
                // Far path first (will be reordered)
                {
                    kind: "path",
                    id: "path1",
                    layerId: "l1",
                    transform: { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 },
                    closed: true,
                    points: [{ x: 50, y: 50 }, { x: 60, y: 50 }, { x: 60, y: 60 }, { x: 50, y: 60 }]
                },
                // Near path second (should be first after optimization)
                {
                    kind: "path",
                    id: "path2",
                    layerId: "l1",
                    transform: { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 },
                    closed: true,
                    points: [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 }]
                },
                // Middle path last
                {
                    kind: "path",
                    id: "path3",
                    layerId: "l1",
                    transform: { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 },
                    closed: true,
                    points: [{ x: 25, y: 25 }, { x: 35, y: 25 }, { x: 35, y: 35 }, { x: 25, y: 35 }]
                }
            ]
        };

        const camOptimized: CamSettings = {
            operations: [{ id: "op1", name: "Cut", mode: "line", speed: 500, power: 100, passes: 1 }],
            optimizePaths: true
        };

        const camUnoptimized: CamSettings = {
            ...camOptimized,
            optimizePaths: false
        };

        // Generate both versions
        const planOpt = planCam(doc, camOptimized);
        const gcodeOpt = emitGcode(planOpt.plan, camOptimized, machine, dialect);

        const planUnopt = planCam(doc, camUnoptimized);
        const gcodeUnopt = emitGcode(planUnopt.plan, camUnoptimized, machine, dialect);

        // Verify both jobs have the same marking distance (only travel differs)
        expect(gcodeOpt.stats.markMm).toBe(gcodeUnopt.stats.markMm);

        // Verify travel distance is reduced
        expect(gcodeOpt.stats.travelMm).toBeLessThan(gcodeUnopt.stats.travelMm);
    });
});
