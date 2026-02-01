import { Document, CamSettings } from "../model";

/**
 * Subset of AppState that is worth tracking in history.
 * We exclude volatile things like machine status, terminal logs, or connection states.
 */
export type UndoableState = {
    document: Document;
    camSettings: CamSettings;
    selectedObjectId: string | null;
};

export type History = {
    past: UndoableState[];
    present: UndoableState;
    future: UndoableState[];
};

const MAX_HISTORY = 50;

/**
 * Creates an initial history object.
 */
export function createHistory(initialState: UndoableState): History {
    return {
        past: [],
        present: JSON.parse(JSON.stringify(initialState)), // Deep clone to avoid mutations
        future: []
    };
}

/**
 * Pushes a new state to the history. 
 * Clears the future (redo stack).
 */
export function pushState(history: History, newState: UndoableState): History {
    // If the state is identical to the present, do nothing
    // Simple JSON stringify comparison for simplicity, though deep equals is better
    const currentStr = JSON.stringify(history.present);
    const nextStr = JSON.stringify(newState);

    if (currentStr === nextStr) {
        return history;
    }

    const newPast = [...history.past, history.present];
    if (newPast.length > MAX_HISTORY) {
        newPast.shift();
    }

    return {
        past: newPast,
        present: JSON.parse(nextStr),
        future: []
    };
}

/**
 * Moves the present state to the future and replaces it with the last state from the past.
 */
export function undo(history: History): History {
    if (history.past.length === 0) {
        return history;
    }

    const previous = history.past[history.past.length - 1];
    const newPast = history.past.slice(0, history.past.length - 1);

    return {
        past: newPast,
        present: previous,
        future: [history.present, ...history.future]
    };
}

/**
 * Moves the present state to the past and replaces it with the first state from the future.
 */
export function redo(history: History): History {
    if (history.future.length === 0) {
        return history;
    }

    const next = history.future[0];
    const newFuture = history.future.slice(1);

    return {
        past: [...history.past, history.present],
        present: next,
        future: newFuture
    };
}

/**
 * Helper to check if undo/redo is available.
 */
export function canUndo(history: History): boolean {
    return history.past.length > 0;
}

export function canRedo(history: History): boolean {
    return history.future.length > 0;
}
