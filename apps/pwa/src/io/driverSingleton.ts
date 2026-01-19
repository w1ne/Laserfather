import { createWebSerialGrblDriver, createSimulatedGrblDriver, GrblDriver } from "./grblDriver";

let driverInstance: GrblDriver | null = null;

let useSimulation = false;

export function setUseSimulation(enabled: boolean) {
    if (useSimulation !== enabled) {
        useSimulation = enabled;
        driverInstance = null; // Force recreation on next get
    }
}

export function isSimulation(): boolean {
    return useSimulation;
}

export function getDriver(): GrblDriver {
    if (!driverInstance) {
        if (useSimulation) {
            driverInstance = createSimulatedGrblDriver({
                responseDelayMs: 50,
                initialState: "IDLE"
            });
        } else {
            driverInstance = createWebSerialGrblDriver();
        }
    }
    return driverInstance;
}
