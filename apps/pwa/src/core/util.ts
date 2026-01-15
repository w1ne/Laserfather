import { Operation, Layer } from "./model";

export function formatNumber(value: number) {
    return Number.isFinite(value) ? value.toFixed(2) : "0.00";
}

export function updateOperation(
    operations: Operation[],
    opId: string,
    updater: (op: Operation) => Operation
): Operation[] {
    return operations.map((op) => (op.id === opId ? updater(op) : op));
}

export function updateLayer(layers: Layer[], layerId: string, updater: (layer: Layer) => Layer): Layer[] {
    return layers.map((layer) => (layer.id === layerId ? updater(layer) : layer));
}
