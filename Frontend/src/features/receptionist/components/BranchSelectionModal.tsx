import React, { useState } from "react";
import { useBranches } from "../../lookups/hooks/useLookups";
import { useUpdateReceptionistBranch } from "../hooks/useReceptionistAppointments";
import { Building2, X, CheckCircle2, AlertCircle } from "lucide-react";

interface BranchSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentBranchName?: string | null;
}

export function BranchSelectionModal({ isOpen, onClose, currentBranchName }: BranchSelectionModalProps) {
    const { data: branches = [], isLoading: isLoadingBranches } = useBranches();
    const updateBranchMutation = useUpdateReceptionistBranch();
    const [selectedBranchId, setSelectedBranchId] = useState<string>("");

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedBranchId) return;

        updateBranchMutation.mutate(selectedBranchId, {
            onSuccess: () => {
                const branch = branches.find(b => b.id === selectedBranchId);
                if (branch) {
                    localStorage.setItem('receptionistActiveBranchName', branch.name);
                }
                onClose();
                setSelectedBranchId("");
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm !p-4">
            <div className="w-full max-w-md bg-white dark:bg-[#12141c] rounded-3xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                {/* Header */}
                <div className="flex items-center justify-between !p-6 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
                            <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Switch Active Branch</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Change your reception desk location</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="!p-6 space-y-6">
                    {currentBranchName && (
                        <div className="!p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block !mb-1">Currently Active</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{currentBranchName}</span>
                        </div>
                    )}

                    {updateBranchMutation.isError && (
                        <div className="!p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900 flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs font-medium">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            Failed to update branch. Please try again.
                        </div>
                    )}

                    {updateBranchMutation.isSuccess && (
                        <div className="!p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900 flex items-center gap-2 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
                            <CheckCircle2 className="h-4 w-4 shrink-0" />
                            Branch successfully updated!
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                                Select New Branch
                            </label>
                            <select
                                value={selectedBranchId}
                                onChange={(e) => setSelectedBranchId(e.target.value)}
                                disabled={isLoadingBranches || updateBranchMutation.isPending}
                                className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 !px-4 !py-3 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50"
                            >
                                <option value="" disabled>Select a branch...</option>
                                {branches.map((branch) => (
                                    <option key={branch.id} value={branch.id}>
                                        {branch.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-3 !pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={updateBranchMutation.isPending}
                                className="flex-1 !py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!selectedBranchId || updateBranchMutation.isPending}
                                className="flex-1 !py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
                            >
                                {updateBranchMutation.isPending ? "Updating..." : "Switch Branch"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
