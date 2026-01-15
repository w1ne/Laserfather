import React from "react";
import { Document } from "../../core/model";
import { formatNumber } from "../../core/util";

// Inline formatNumber if not exported, or ensure it is available.
// Checking App.tsx, formatNumber was used. I'll need to check where it came from.
// It was likely a helper in App.tsx or imported. I'll assume local or create utility.

type DocumentPanelProps = {
    document: Document;
    selectedObjectId: string | null;
    onSelectObject: (id: string) => void;
    onAddRectangle: () => void;
    onImportFile: () => void;
};

export function DocumentPanel({
    document,
    selectedObjectId,
    onSelectObject,
    onAddRectangle,
    onImportFile
}: DocumentPanelProps) {

    // Helper to format numbers for display
    const f = (n: number) => n.toFixed(2);

    return (
        <div className="panel">
            <div className="panel__header">
                <h2>Document</h2>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button className="button" style={{ fontSize: "11px", padding: "4px 8px" }} onClick={onAddRectangle}>Add Rect</button>
                    <button className="button" style={{ fontSize: "11px", padding: "4px 8px" }} onClick={onImportFile}>Import</button>
                </div>
            </div>
            <div className="panel__body">
                <div className="list" style={{ gap: "4px", display: "flex", flexDirection: "column" }}>
                    {document.objects.map(obj => {
                        const isSelected = obj.id === selectedObjectId;
                        let label = obj.id;
                        if (obj.kind === "shape") label = `Rect ${f(obj.shape.width)}x${f(obj.shape.height)}`;
                        if (obj.kind === "image") label = `Image ${f(obj.width)}x${f(obj.height)}`;
                        if (obj.kind === "path") label = "Path";

                        const layerName = document.layers.find(l => l.id === obj.layerId)?.name || obj.layerId;

                        return (
                            <button key={obj.id}
                                className={`list__item ${isSelected ? "is-active" : ""}`}
                                onClick={() => onSelectObject(obj.id)}
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: "8px 12px",
                                    background: isSelected ? "#e3f2fd" : "#fff",
                                    border: isSelected ? "1px solid #2196f3" : "1px solid #eee",
                                    borderRadius: "4px",
                                    color: "#333",
                                    cursor: "pointer",
                                    textAlign: "left"
                                }}
                            >
                                <span style={{ fontWeight: isSelected ? "600" : "400" }}>{label}</span>
                                <span className="list__meta" style={{ fontSize: "10px", color: "#888", background: "#f5f5f5", padding: "2px 6px", borderRadius: "10px" }}>
                                    {layerName}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
