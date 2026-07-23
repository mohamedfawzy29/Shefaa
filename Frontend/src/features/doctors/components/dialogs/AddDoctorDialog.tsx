/**
 * Placeholder — the Admin DoctorController does NOT expose a POST endpoint.
 * This dialog is kept as a stub so imports don't break if referenced elsewhere.
 */
interface AddDoctorDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddDoctorDialog({ isOpen, onClose }: AddDoctorDialogProps) {
    if (!isOpen) return null;

    return (
        <div className="p-4 text-sm text-slate-500">
            <p>Doctor creation is not available from the Admin panel.</p>
            <button onClick={onClose} className="mt-2 text-blue-600 hover:underline">Close</button>
        </div>
    );
}
