import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../../../../components/ui/Modal";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import { Select } from "../../../../components/ui/Select";
import { useCreateReceptionist } from "../../hooks/useReceptionists";
import { useBranches } from "../../../branches/hooks/useBranches";
import {
    createReceptionistSchema,
    type CreateReceptionistFormData,
} from "../../validation/receptionistSchema";

interface CreateReceptionistDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateReceptionistDialog({ isOpen, onClose }: CreateReceptionistDialogProps) {
    const createMutation = useCreateReceptionist();
    const { data: branches, isLoading: isLoadingBranches } = useBranches();

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm<CreateReceptionistFormData>({
        resolver: zodResolver(createReceptionistSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            userName: "",
            password: "",
            gender: "Male",
            dateOfBirth: "",
            branchId: "",
            phoneNumbers: "",
        },
    });

    const handleClose = () => {
        reset();
        onClose();
    };

    const onSubmit = (data: CreateReceptionistFormData) => {
        const formData = new FormData();
        formData.append("FirstName", data.firstName);
        formData.append("LastName", data.lastName);
        formData.append("Email", data.email);
        formData.append("UserName", data.userName);
        formData.append("Password", data.password);
        formData.append("Gender", data.gender);
        formData.append("DateOfBirth", data.dateOfBirth);
        formData.append("BranchId", data.branchId);

        // handle array
        const phones = data.phoneNumbers.split(",").map(p => p.trim()).filter(Boolean);
        phones.forEach((p, i) => {
            formData.append(`PhoneNumbers[${i}]`, p);
        });

        if (data.profileImg) {
            formData.append("ProfileImg", data.profileImg);
        }

        createMutation.mutate(formData, {
            onSuccess: () => handleClose(),
            onError: (error) => {
                console.error("Failed to create receptionist:", error);
                alert(error instanceof Error ? error.message : "Creation failed.");
            },
        });
    };

    const branchOptions = branches?.map((b) => ({
        label: b.branchName,
        value: b.id,
    })) || [];

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            title="Add Receptionist"
            >
            <p className="text-sm text-slate-500 mb-4">Register a new receptionist.</p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="First Name"
                        {...register("firstName")}
                        error={errors.firstName?.message}
                    />
                    <Input
                        label="Last Name"
                        {...register("lastName")}
                        error={errors.lastName?.message}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Email"
                        type="email"
                        {...register("email")}
                        error={errors.email?.message}
                    />
                    <Input
                        label="Username"
                        {...register("userName")}
                        error={errors.userName?.message}
                    />
                </div>

                <Input
                    label="Password"
                    type="password"
                    {...register("password")}
                    error={errors.password?.message}
                />

                <div className="grid grid-cols-2 gap-4">
                    <Select
                        label="Gender"
                        {...register("gender")}
                        error={errors.gender?.message}
                        options={[
                            { label: "Male", value: "Male" },
                            { label: "Female", value: "Female" },
                        ]}
                    />
                    <Input
                        label="Date of Birth"
                        type="date"
                        {...register("dateOfBirth")}
                        error={errors.dateOfBirth?.message}
                    />
                </div>

                <Select
                    label="Branch"
                    {...register("branchId")}
                    error={errors.branchId?.message}
                    options={[{ label: "Select Branch", value: "" }, ...branchOptions]}
                    disabled={isLoadingBranches}
                />

                <Input
                    label="Phone Numbers (comma separated)"
                    {...register("phoneNumbers")}
                    error={errors.phoneNumbers?.message}
                />

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Profile Image
                    </label>
                    <Controller
                        name="profileImg"
                        control={control}
                        render={({ field: { onChange, ref, name } }) => (
                            <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                ref={ref}
                                name={name}
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) onChange(file);
                                }}
                                className="block w-full text-sm text-slate-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-indigo-50 file:text-indigo-700
                                hover:file:bg-indigo-100"
                            />
                        )}
                    />
                    {errors.profileImg && (
                        <p className="mt-1 text-sm text-red-600">{errors.profileImg.message}</p>
                    )}
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleClose}
                        disabled={isSubmitting || createMutation.isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting || createMutation.isPending}
                        loading={isSubmitting || createMutation.isPending}
                    >
                        Create Receptionist
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
