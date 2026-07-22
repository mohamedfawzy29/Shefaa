import type { UserResponse } from "../../types/userManagement";
import { useLockUser } from "../../hooks/useUserManagement";
import { Modal } from "../../../../components/ui/Modal";
import { Button } from "../../../../components/ui/Button";

interface LockUserDialogProps {
    user: UserResponse | null;
    isOpen: boolean;
    onClose: () => void;
}

export function LockUserDialog({ user, isOpen, onClose }: LockUserDialogProps) {
    const lockMutation = useLockUser();

    const handleLock = () => {
        if (!user) return;
        lockMutation.mutate(user.id, { onSuccess: () => onClose() });
    };

    const footer = (
        <>
            <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
            </Button>
            <Button
                type="button"
                variant="danger"
                loading={lockMutation.isPending}
                onClick={handleLock}
            >
                Lock Account
            </Button>
        </>
    );

    return (
        <Modal
            title="Lock User Account"
            open={isOpen}
            onClose={onClose}
            footer={footer}
            maxWidth="sm"
        >
            <div className="text-center py-2">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-4">
                    <svg
                        className="h-8 w-8 text-red-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                        />
                    </svg>
                </div>
                <p className="text-sm text-slate-500">
                    Are you sure you want to lock{" "}
                    <span className="font-semibold text-slate-700">
                        {user?.firstName ?? ""} {user?.lastName ?? ""}
                    </span>
                    ? They will not be able to log in until unlocked.
                </p>
                {lockMutation.isError && (
                    <p role="alert" className="mt-3 text-sm text-red-600 bg-red-50 rounded-lg p-2">
                        Failed to lock user. Please try again.
                    </p>
                )}
            </div>
        </Modal>
    );
}
