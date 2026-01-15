import { AppState } from "../state/types";
import { Action } from "../state/actions";
import { Layer, Operation } from "../model";

export const LayerService = {
    addLayer: (state: AppState, dispatch: React.Dispatch<Action>) => {
        // Unique ID logic extracted from App.tsx
        const uniqueSuffix = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const newLayerId = `layer-${uniqueSuffix}`;
        const newOpId = `op-${uniqueSuffix}`;

        const newLayer: Layer = {
            id: newLayerId,
            name: `Layer ${state.document.layers.length + 1}`,
            visible: true,
            locked: false,
            operationId: newOpId
        };

        const newOp: Operation = {
            id: newOpId,
            name: "Cut",
            mode: "line",
            speed: 1000,
            power: 50,
            passes: 1,
            order: "insideOut"
        };

        dispatch({ type: "ADD_LAYER", payload: newLayer });
        dispatch({ type: "ADD_OPERATION", payload: newOp });
    },

    deleteLayer: (state: AppState, dispatch: React.Dispatch<Action>, layerId: string) => {
        // Validation Logic
        const hasObjects = state.document.objects.some(obj => obj.layerId === layerId);
        if (hasObjects) {
            alert("Cannot delete this layer because it contains objects. Please reassign or delete the objects first.");
            return;
        }

        if (state.document.layers.length <= 1) {
            alert("Cannot delete the last layer.");
            return;
        }

        dispatch({ type: "DELETE_LAYER", payload: layerId });
        // Ideally we also clean up operations, but it's optional garbage collection.
    }
};
