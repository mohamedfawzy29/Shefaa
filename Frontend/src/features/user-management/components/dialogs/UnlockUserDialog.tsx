import type { UserResponse } from "../../types/userManagement";
import { useUnlockUser } from "../../hooks/useUserManagement";
import { Modal } from "../../../../components/ui/Modal";
import { Button } from "../../../../components/ui/Button";

interface UnlockUserDialogProps {
    user: UserResponse | null;
    isOpen: boolean;
    onClose: () => void;
}

export function UnlockUserDialog({ user, isOpen, onClose }: UnlockUserDialogProps) {
    const unlockMutation = useUnlockUser();

    const handleUnlock = () => {
        if (!user) return;
        unlockMutation.mutate(user.id, { onSuccess: () => onClose() });
    };

    const footer = (
        <>
            <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
            </Button>
            <Button
                type="button"
                variant="primary"
                loading={unlockMutation.isPending}
                onClick={handleUnlock}
            >
                Unlock Account
            </Button>
        </>
    );

    return (
        <Modal
            title="Unlock User Account"
            open={isOpen}
            onClose={onClose}
            footer={footer}
            maxWidth="sm"
        >
            <div className="text-center py-2">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
                    <svg
                        className="h-8 w-8 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                        />
                    </svg>
                </div>
                <p className="text-sm text-slate-500">
                    Unlock{" "}
                    <span className="font-semibold text-slate-700">
                        {user?.firstName ?? ""} {user?.lastName ?? ""}
                    </span>
                    ? They will be able to log in again immediately.
                </p>
                {unlockMutation.isError && (
                    <p role="alert" className="mt-3 text-sm text-red-600 bg-red-50 rounded-lg p-2">
                        Failed to unlock user. Please try again.
                    </p>
                )}
            </div>
        </Modal>
    );
}
