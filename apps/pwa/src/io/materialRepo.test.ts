// @vitest-environment node
import { describe, it, expect, beforeEach } from 'vitest';
import "fake-indexeddb/auto";
import { materialRepo } from './materialRepo';
import { MaterialPreset } from '../core/model';

describe('materialRepo', () => {
    beforeEach(async () => {
        // We don't have a getDb for materialRepo exposed, but it uses its own DB_NAME.
        // IDB might persistent across tests in fake-indexeddb if not careful.
        // materialRepo.dbPromise is private.
        // For testing purposes, we can just hope it's clean or manage it via global indexedDB.
        const dbs = await indexedDB.databases();
        for (const dbInfo of dbs) {
            if (dbInfo.name) await indexedDB.deleteDatabase(dbInfo.name);
        }
    });

    const mockPreset: MaterialPreset = {
        id: "test-preset",
        name: "Test Preset",
        mode: "line",
        speed: 1000,
        power: 50,
        passes: 1
    };

    it('should initialize defaults when empty', async () => {
        await materialRepo.initDefaults();
        const list = await materialRepo.list();
        expect(list.length).toBeGreaterThan(0);
        expect(list.find(p => p.id === "wood-cut")).toBeDefined();
    });

    it('should save and list presets', async () => {
        await materialRepo.save(mockPreset);
        const list = await materialRepo.list();
        expect(list).toContainEqual(mockPreset);
    });

    it('should delete presets', async () => {
        await materialRepo.save(mockPreset);
        await materialRepo.delete(mockPreset.id);
        const list = await materialRepo.list();
        expect(list.find(p => p.id === mockPreset.id)).toBeUndefined();
    });
});
