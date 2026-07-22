/**
 * Placeholder — the Admin DoctorController does NOT expose a DELETE endpoint.
 */
import type { Doctor } from "../../types/doctor";

interface DeleteDoctorDialogProps {
    doctor: Doctor | null;
    isOpen: boolean;
    onClose: () => void;
}

export function DeleteDoctorDialog({ isOpen, onClose }: DeleteDoctorDialogProps) {
    if (!isOpen) return null;

    return (
        <div className="p-4 text-sm text-slate-500">
            <p>Doctor deletion is not available from the Admin panel.</p>
            <button onClick={onClose} className="mt-2 text-blue-600 hover:underline">Close</button>
        </div>
    );
}
