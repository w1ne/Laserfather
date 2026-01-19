import React, { useState } from "react";
import { useStore } from "../../core/state/store";
import { MachineProfile } from "../../core/model";
import { machineRepo } from "../../io/machineRepo";
import { INITIAL_MACHINE_PROFILE } from "../../core/state/types";

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

export function MachineManagerDialog({ isOpen, onClose }: Props) {
    const { state, dispatch } = useStore();
    const { machineProfiles, activeMachineProfileId } = state;

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<MachineProfile | null>(null);

    if (!isOpen) return null;

    const handleEdit = (profile: MachineProfile) => {
        setEditingId(profile.id);
        setEditForm({ ...profile });
    };

    const handleCreate = () => {
        const newProfile: MachineProfile = {
            ...INITIAL_MACHINE_PROFILE,
            id: `machine-${Date.now()}`,
            name: "New Machine",
        };
        setEditingId(newProfile.id);
        setEditForm(newProfile);
    };

    const handleSave = async () => {
        if (!editForm) return;

        // Persist
        await machineRepo.save(editForm);

        // Update Store
        if (machineProfiles.find(p => p.id === editForm.id)) {
            dispatch({ type: "UPDATE_MACHINE_PROFILE", payload: { id: editForm.id, changes: editForm } });
        } else {
            dispatch({ type: "ADD_MACHINE_PROFILE", payload: editForm });
        }

        setEditingId(null);
        setEditForm(null);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this machine profile?")) return;
        await machineRepo.delete(id);
        dispatch({ type: "DELETE_MACHINE_PROFILE", payload: id });
    };

    const handleSelect = (id: string) => {
        dispatch({ type: "SELECT_MACHINE_PROFILE", payload: id });
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h3>Manage Machines</h3>
                    <button onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    {editingId && editForm ? (
                        <div className="edit-form">
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    value={editForm.name}
                                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                />
                            </div>
                            <div className="form-row">
                                <label>
                                    Width (mm)
                                    <input
                                        type="number"
                                        value={editForm.bedMm.w}
                                        onChange={e => setEditForm({ ...editForm, bedMm: { ...editForm.bedMm, w: e.target.valueAsNumber } })}
                                    />
                                </label>
                                <label>
                                    Height (mm)
                                    <input
                                        type="number"
                                        value={editForm.bedMm.h}
                                        onChange={e => setEditForm({ ...editForm, bedMm: { ...editForm.bedMm, h: e.target.valueAsNumber } })}
                                    />
                                </label>
                            </div>
                            <div className="form-row">
                                <label>
                                    S-Min
                                    <input
                                        type="number"
                                        value={editForm.sRange.min}
                                        onChange={e => setEditForm({ ...editForm, sRange: { ...editForm.sRange, min: e.target.valueAsNumber } })}
                                    />
                                </label>
                                <label>
                                    S-Max
                                    <input
                                        type="number"
                                        value={editForm.sRange.max}
                                        onChange={e => setEditForm({ ...editForm, sRange: { ...editForm.sRange, max: e.target.valueAsNumber } })}
                                    />
                                </label>
                            </div>
                            <div className="form-group">
                                <label>Baud Rate</label>
                                <select
                                    value={editForm.baudRate}
                                    onChange={e => setEditForm({ ...editForm, baudRate: Number(e.target.value) })}
                                >
                                    <option value={115200}>115200</option>
                                    <option value={57600}>57600</option>
                                    <option value={38400}>38400</option>
                                    <option value={9600}>9600</option>
                                </select>
                            </div>

                            <div className="form-actions">
                                <button className="button" onClick={() => setEditingId(null)}>Cancel</button>
                                <button className="button button--primary" onClick={handleSave}>Save</button>
                            </div>
                        </div>
                    ) : (
                        <div className="machine-list">
                            {machineProfiles.map(p => (
                                <div key={p.id} className={`machine-item ${p.id === activeMachineProfileId ? "active" : ""}`}>
                                    <div className="machine-info" onClick={() => handleSelect(p.id)}>
                                        <div className="machine-name">{p.name}</div>
                                        <div className="machine-meta">{p.bedMm.w}x{p.bedMm.h}mm | {p.baudRate} baud</div>
                                    </div>
                                    <div className="machine-actions">
                                        <button className="button button--small" onClick={() => handleEdit(p)}>Edit</button>
                                        {machineProfiles.length > 1 && (
                                            <button className="button button--small button--danger" onClick={() => handleDelete(p.id)}>Del</button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <button className="button button--full" onClick={handleCreate}>+ Add Machine</button>
                        </div>
                    )}
                </div>
            </div>
            <style>{`
                .modal-overlay {
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex; align-items: center; justify-content: center;
                    z-index: 1000;
                }
                .modal {
                    background: #fff;
                    width: 400px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                    overflow: hidden;
                    color: #333;
                }
                .modal-header {
                    padding: 12px 16px;
                    border-bottom: 1px solid #eee;
                    display: flex; justify-content: space-between; align-items: center;
                }
                .modal-header h3 { margin: 0; font-size: 16px; }
                .modal-body { padding: 16px; }
                
                .machine-item {
                    display: flex; justify-content: space-between; align-items: center;
                    padding: 8px; border: 1px solid #eee; border-radius: 4px; margin-bottom: 8px;
                    cursor: pointer;
                }
                .machine-item.active { border-color: #2196f3; background: #e3f2fd; }
                .machine-info { flex: 1; }
                .machine-name { font-weight: 600; font-size: 14px; }
                .machine-meta { font-size: 11px; color: #666; }
                .machine-actions { display: flex; gap: 4px; }
                
                .edit-form { display: flex; flex-direction: column; gap: 12px; }
                .form-group label { display: block; font-size: 12px; margin-bottom: 4px; color: #555; }
                .form-group input, .form-group select { width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px; }
                .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
                .form-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 8px; }
                
                .button { padding: 6px 12px; border: 1px solid #ddd; background: #fff; border-radius: 4px; cursor: pointer; font-size: 13px; }
                .button--primary { background: #2196f3; color: white; border-color: #2196f3; }
                .button--danger { color: #d32f2f; border-color: #ffcdd2; background: #ffebee; }
                .button--small { padding: 2px 6px; font-size: 11px; }
                .button--full { width: 100%; margin-top: 8px; }
            `}</style>
        </div>
    );
}
