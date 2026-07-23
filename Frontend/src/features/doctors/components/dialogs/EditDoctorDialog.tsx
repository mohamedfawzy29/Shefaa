/**
 * Placeholder — the Admin DoctorController does NOT expose a PUT endpoint.
 */
import type { Doctor } from "../../types/doctor";

interface EditDoctorDialogProps {
    doctor: Doctor | null;
    isOpen: boolean;
    onClose: () => void;
}

export function EditDoctorDialog({ isOpen, onClose }: EditDoctorDialogProps) {
    if (!isOpen) return null;

    return (
        <div className="p-4 text-sm text-slate-500">
            <p>Doctor editing is not available from the Admin panel.</p>
            <button onClick={onClose} className="mt-2 text-blue-600 hover:underline">Close</button>
        </div>
    );
}
