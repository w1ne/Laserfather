import type { PolylinePath, Point } from "./model";

/**
 * Calculate the centroid (center point) of a path.
 * Uses the average of all points in the path.
 */
export function getPathCentroid(path: PolylinePath): Point {
    if (path.points.length === 0) {
        return { x: 0, y: 0 };
    }

    let sumX = 0;
    let sumY = 0;

    for (const point of path.points) {
        sumX += point.x;
        sumY += point.y;
    }

    return {
        x: sumX / path.points.length,
        y: sumY / path.points.length
    };
}

/**
 * Calculate Euclidean distance between two points.
 */
export function distance(a: Point, b: Point): number {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Optimize path order using nearest neighbor algorithm.
 * Reduces air travel time by reordering paths to minimize distance between them.
 * 
 * @param paths Array of paths to optimize
 * @returns Reordered paths with minimized travel distance
 */
export function optimizePaths(paths: PolylinePath[]): PolylinePath[] {
    if (paths.length <= 1) {
        return paths;
    }

    const unvisited = new Set(paths.map((_, i) => i));
    const result: PolylinePath[] = [];

    // Start with the first path (closest to origin)
    let currentIndex = 0;
    let minDist = Infinity;

    for (let i = 0; i < paths.length; i++) {
        const centroid = getPathCentroid(paths[i]);
        const dist = distance({ x: 0, y: 0 }, centroid);
        if (dist < minDist) {
            minDist = dist;
            currentIndex = i;
        }
    }

    result.push(paths[currentIndex]);
    unvisited.delete(currentIndex);

    // Nearest neighbor: always pick the closest unvisited path
    while (unvisited.size > 0) {
        const currentPath = result[result.length - 1];
        const currentEnd = currentPath.points[currentPath.points.length - 1];

        let nearestIndex = -1;
        let nearestDistance = Infinity;

        for (const i of unvisited) {
            const pathStart = paths[i].points[0];
            const dist = distance(currentEnd, pathStart);

            if (dist < nearestDistance) {
                nearestDistance = dist;
                nearestIndex = i;
            }
        }

        result.push(paths[nearestIndex]);
        unvisited.delete(nearestIndex);
    }

    return result;
}

/**
 * Calculate total travel distance for a sequence of paths.
 * Includes travel from origin to first path and between all paths.
 */
export function calculateTotalTravel(paths: PolylinePath[]): number {
    if (paths.length === 0) return 0;

    let total = 0;

    // Distance from origin to first path
    const firstStart = paths[0].points[0];
    total += distance({ x: 0, y: 0 }, firstStart);

    // Distance between paths
    for (let i = 0; i < paths.length - 1; i++) {
        const currentEnd = paths[i].points[paths[i].points.length - 1];
        const nextStart = paths[i + 1].points[0];
        total += distance(currentEnd, nextStart);
    }

    return total;
}
