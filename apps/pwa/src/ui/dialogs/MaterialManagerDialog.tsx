import React from "react";
import { useStore } from "../../core/state/store";
import { materialRepo } from "../../io/materialRepo";

type MaterialManagerDialogProps = {
    isOpen: boolean;
    onClose: () => void;
};

export function MaterialManagerDialog({ isOpen, onClose }: MaterialManagerDialogProps) {
    const { state, dispatch } = useStore();
    const { materialPresets } = state;

    if (!isOpen) return null;

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("Delete this preset?")) {
            await materialRepo.delete(id);
            dispatch({ type: "DELETE_MATERIAL_PRESET", payload: id });
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Manage Materials</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                <div className="modal-body" style={{ maxHeight: "400px", overflowY: "auto" }}>
                    {materialPresets.length === 0 ? (
                        <p style={{ color: "#666", textAlign: "center", padding: "20px" }}>No presets saved.</p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {materialPresets.map(p => (
                                <div key={p.id} style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: "10px",
                                    background: "#f8f9fa",
                                    borderRadius: "8px",
                                    border: "1px solid #e2e8f0"
                                }}>
                                    <div>
                                        <div style={{ fontWeight: "600", fontSize: "14px", color: "#1e293b" }}>{p.name}</div>
                                        <div style={{ fontSize: "11px", color: "#64748b" }}>
                                            {p.mode === "line" ? "Line" : "Fill"} • {p.speed}mm/m • {p.power}% • {p.passes}p
                                        </div>
                                    </div>
                                    <button
                                        className="button button--danger"
                                        style={{ fontSize: "11px", padding: "4px 8px", minHeight: "auto", background: "#fff5f5", color: "#d32f2f" }}
                                        onClick={(e) => handleDelete(p.id, e)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="modal-footer">
                    <button className="button" onClick={onClose}>Close</button>
                </div>
            </div>
            <style>{`
                .modal-overlay {
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex; align-items: center; justify-content: center;
                    z-index: 1000;
                    backdrop-filter: blur(2px);
                }
                .modal-content {
                    background: white;
                    padding: 24px;
                    border-radius: 12px;
                    width: 450px;
                    max-width: 95vw;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                }
                .modal-header {
                    display: flex; justify-content: space-between; align-items: center;
                    margin-bottom: 16px;
                }
                .modal-header h2 { margin: 0; font-size: 20px; color: #1e293b; }
                .close-button {
                    background: none; border: none; font-size: 24px; cursor: pointer; color: #64748b;
                }
                .modal-footer {
                    margin-top: 24px; display: flex; justify-content: flex-end;
                }
            `}</style>
        </div>
    );
}
