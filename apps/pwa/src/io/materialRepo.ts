import { openDB, DBSchema, IDBPDatabase } from "idb";
import { MaterialPreset } from "../core/model";

interface MaterialDB extends DBSchema {
    presets: {
        key: string;
        value: MaterialPreset;
    };
}

const DB_NAME = "laseryx-materials";
const DB_VERSION = 1;

class MaterialRepository {
    private dbPromise: Promise<IDBPDatabase<MaterialDB>>;

    constructor() {
        this.dbPromise = openDB<MaterialDB>(DB_NAME, DB_VERSION, {
            upgrade(db) {
                if (!db.objectStoreNames.contains("presets")) {
                    db.createObjectStore("presets", { keyPath: "id" });
                }
            },
        });
    }

    async save(preset: MaterialPreset): Promise<void> {
        const db = await this.dbPromise;
        await db.put("presets", preset);
    }

    async list(): Promise<MaterialPreset[]> {
        const db = await this.dbPromise;
        return await db.getAll("presets");
    }

    async delete(id: string): Promise<void> {
        const db = await this.dbPromise;
        await db.delete("presets", id);
    }

    async initDefaults(): Promise<void> {
        const db = await this.dbPromise;
        const count = await db.count("presets");
        if (count === 0) {
            const defaults: MaterialPreset[] = [
                { id: "wood-cut", name: "Wood Cut (Plywood 3mm)", mode: "line", speed: 600, power: 90, passes: 2 },
                { id: "wood-engrave", name: "Wood Engrave", mode: "fill", speed: 2000, power: 20, passes: 1, lineInterval: 0.1 },
                { id: "acrylic-cut", name: "Acrylic Cut (3mm)", mode: "line", speed: 400, power: 100, passes: 1 },
                { id: "leather-mark", name: "Leather Mark", mode: "line", speed: 1200, power: 15, passes: 1 },
            ];
            for (const preset of defaults) {
                await this.save(preset);
            }
        }
    }
}

export const materialRepo = new MaterialRepository();
