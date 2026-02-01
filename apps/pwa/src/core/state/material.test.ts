import { describe, it, expect } from 'vitest';
import { appReducer } from './reducer';
import { AppState, INITIAL_STATE } from './types';
import { MaterialPreset } from '../model';

describe('material reducer', () => {
    const mockPreset: MaterialPreset = {
        id: "p1",
        name: "Preset 1",
        mode: "line",
        speed: 100,
        power: 50,
        passes: 1
    };

    it('should handle SET_MATERIAL_PRESETS', () => {
        const presets = [mockPreset];
        const state = appReducer(INITIAL_STATE, { type: "SET_MATERIAL_PRESETS", payload: presets });
        expect(state.materialPresets).toEqual(presets);
    });

    it('should handle ADD_MATERIAL_PRESET', () => {
        const state = appReducer(INITIAL_STATE, { type: "ADD_MATERIAL_PRESET", payload: mockPreset });
        expect(state.materialPresets).toContainEqual(mockPreset);
    });

    it('should handle DELETE_MATERIAL_PRESET', () => {
        const initialState: AppState = {
            ...INITIAL_STATE,
            materialPresets: [mockPreset]
        };
        const state = appReducer(initialState, { type: "DELETE_MATERIAL_PRESET", payload: mockPreset.id });
        expect(state.materialPresets).not.toContainEqual(mockPreset);
    });
});
