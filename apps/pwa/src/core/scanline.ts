import { Point, PolylinePath } from "./model";

type Segment = {
    p1: Point;
    p2: Point;
};

/**
 * Generates a scanline fill for a set of closed paths.
 * Uses a standard scanline algorithm (Even-Odd rule).
 */
export function scanlineFill(
    paths: PolylinePath[],
    lineInterval: number,
    _angle: number = 0 // Rotation support to be added later, for now assuming 0 (horizontal)
): PolylinePath[] {
    if (paths.length === 0) return [];

    // 1. Flatten all closed paths into a list of segments
    const segments: Segment[] = [];
    let minY = Infinity;
    let maxY = -Infinity;

    for (const path of paths) {
        if (!path.closed || path.points.length < 3) continue;

        for (let i = 0; i < path.points.length; i++) {
            const p1 = path.points[i];
            const p2 = path.points[(i + 1) % path.points.length];

            // Skip horizontal segments as they don't contribute to intersection logic
            // (or handled effectively by the scanline itself)
            if (Math.abs(p1.y - p2.y) < 1e-9) continue;

            segments.push({ p1, p2 });

            minY = Math.min(minY, p1.y, p2.y);
            maxY = Math.max(maxY, p1.y, p2.y);
        }
    }

    if (segments.length === 0) return [];

    const fillPaths: PolylinePath[] = [];

    // 2. Iterate from minY to maxY by interval
    // Start slightly offset to avoid hitting vertices exactly (simple robustness trick)
    let y = minY + lineInterval / 2;

    while (y <= maxY) {
        const intersections: number[] = [];

        for (const seg of segments) {
            // Check if Y intersects this segment
            const yMin = Math.min(seg.p1.y, seg.p2.y);
            const yMax = Math.max(seg.p1.y, seg.p2.y);

            // Strict inequality for one bound to avoid double counting shared vertices
            if (y >= yMin && y < yMax) {
                // Find X intersection: x = x1 + (y - y1) * (x2 - x1) / (y2 - y1)
                const t = (y - seg.p1.y) / (seg.p2.y - seg.p1.y);
                const x = seg.p1.x + t * (seg.p2.x - seg.p1.x);
                intersections.push(x);
            }
        }

        // 3. Sort intersections
        intersections.sort((a, b) => a - b);

        // 4. Pair up (0-1, 2-3, etc.) - Even-Odd Rule
        for (let i = 0; i < intersections.length; i += 2) {
            if (i + 1 < intersections.length) {
                const x1 = intersections[i];
                const x2 = intersections[i + 1];

                // Add fill line
                fillPaths.push({
                    closed: false,
                    points: [{ x: x1, y }, { x: x2, y }]
                });
            }
        }

        y += lineInterval;
    }

    // Bidirectional optimization (zig-zag) can be done at the G-code generation level 
    // or we can reverse every other path here.
    // Let's reverse every other path here for better visual preview order.
    for (let i = 1; i < fillPaths.length; i += 2) {
        fillPaths[i].points.reverse();
    }

    return fillPaths;
}
