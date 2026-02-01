import { getDb } from "./db";

/**
 * Scans all projects and identifies which assets are still referenced.
 * Returns a Set of asset IDs that are currently in use.
 */
async function getReferencedAssets(): Promise<Set<string>> {
    const db = await getDb();
    const projects = await db.getAll("projects");
    const referenced = new Set<string>();

    for (const project of projects) {
        for (const obj of project.document.objects) {
            if (obj.kind === "image") {
                // obj.src should be the asset ID when stored
                referenced.add(obj.src);
            }
        }
    }

    return referenced;
}

/**
 * Performs garbage collection on the assets store.
 * Deletes all assets that are not referenced by any project.
 * Returns the number of assets deleted.
 */
export async function collectGarbage(): Promise<number> {
    const db = await getDb();

    // 1. Get all referenced assets
    const referenced = await getReferencedAssets();

    // 2. Get all stored assets
    const allAssets = await db.getAllKeys("assets");

    // 3. Find orphaned assets
    const orphaned = allAssets.filter(id => !referenced.has(id));

    // 4. Delete orphaned assets
    if (orphaned.length > 0) {
        const tx = db.transaction("assets", "readwrite");
        const store = tx.objectStore("assets");

        await Promise.all(orphaned.map(id => store.delete(id)));
        await tx.done;
    }

    return orphaned.length;
}

/**
 * Gets the total size of all assets in bytes.
 * Useful for displaying storage usage to users.
 */
export async function getAssetStorageSize(): Promise<number> {
    const db = await getDb();
    const assets = await db.getAll("assets");

    let totalBytes = 0;
    for (const asset of assets) {
        totalBytes += asset.data.size;
    }

    return totalBytes;
}
