import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PageContainer from "../../components/layout/PageContainer";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import { ErrorState } from "../../components/ui/ErrorState";
import {
    useProfile,
    useUpdateProfile,
    useUpdatePassword,
    useUpdateProfileImage,
} from "../../features/profile/hooks/useProfile";
import {
    profileSchema,
    passwordSchema,
    type ProfileFormData,
    type PasswordFormData,
} from "../../features/profile/validation/profileSchema";

export default function ProfilePage() {
    const { data: profile, isLoading, isError, error, refetch } = useProfile();
    const updateProfileMutation = useUpdateProfile();
    const updatePasswordMutation = useUpdatePassword();
    const updateImageMutation = useUpdateProfileImage();

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form feedback states
    const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
    const [profileError, setProfileError] = useState<string | null>(null);
    const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [imageError, setImageError] = useState<string | null>(null);

    // Profile details form
    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        reset: resetProfile,
        formState: { errors: profileErrors },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
    });

    // Password form
    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        reset: resetPassword,
        formState: { errors: passwordErrors },
    } = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
    });

    // Populate profile form when data is loaded
    useEffect(() => {
        if (profile) {
            resetProfile({
                firstName: profile.firstName,
                lastName: profile.lastName,
                gender: profile.gender,
                dateOfBirth: profile.dateOfBirth,
                phoneNumbers: profile.phoneNumbers?.join(", ") || "",
            });
        }
    }, [profile, resetProfile]);

    if (isLoading) {
        return (
            <PageContainer title="My Profile" description="Manage your personal account profile.">
                <div className="space-y-6 animate-pulse">
                    <div className="h-32 bg-slate-200 rounded-xl w-full" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="h-64 bg-slate-200 rounded-xl" />
                        <div className="h-64 bg-slate-200 rounded-xl" />
                    </div>
                </div>
            </PageContainer>
        );
    }

    if (isError) {
        return (
            <PageContainer title="My Profile" description="Manage your personal account profile.">
                <ErrorState
                    description={error instanceof Error ? error.message : "Failed to load profile data."}
                    onRetry={() => refetch()}
                />
            </PageContainer>
        );
    }

    const onProfileSubmit = (data: ProfileFormData) => {
        setProfileSuccess(null);
        setProfileError(null);

        // Convert phoneNumbers comma-separated string to string[]
        const phoneNumbersArray = data.phoneNumbers
            ? data.phoneNumbers.split(",").map((p) => p.trim()).filter(Boolean)
            : [];

        updateProfileMutation.mutate(
            {
                firstName: data.firstName,
                lastName: data.lastName,
                gender: data.gender,
                dateOfBirth: data.dateOfBirth,
                phoneNumbers: phoneNumbersArray,
            },
            {
                onSuccess: () => {
                    setProfileSuccess("Profile details updated successfully!");
                },
                onError: (err: any) => {
                    setProfileError(err.response?.data?.message || err.message || "Failed to update profile.");
                },
            }
        );
    };

    const onPasswordSubmit = (data: PasswordFormData) => {
        setPasswordSuccess(null);
        setPasswordError(null);

        updatePasswordMutation.mutate(
            {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
                confirmPassword: data.confirmPassword,
            },
            {
                onSuccess: () => {
                    setPasswordSuccess("Password updated successfully!");
                    resetPassword();
                },
                onError: (err: any) => {
                    const validationErrors = err.response?.data?.errors;
                    const errorMsg = Array.isArray(validationErrors)
                        ? validationErrors.join(". ")
                        : err.response?.data?.message || err.message || "Failed to update password.";
                    setPasswordError(errorMsg);
                },
            }
        );
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        setImageError(null);
        const file = e.target.files?.[0];
        if (!file) return;

        // Size check: limit to 2MB
        if (file.size > 2 * 1024 * 1024) {
            setImageError("Image size must be less than 2MB.");
            return;
        }

        updateImageMutation.mutate(file, {
            onSuccess: () => {
                // Image successfully updated
            },
            onError: (err: any) => {
                setImageError(err.response?.data?.message || err.message || "Failed to upload image.");
            },
        });
    };

    // Helper to get correct profile image URL
    const getProfileImageUrl = (img?: string) => {
        if (!img || img === "default.png") return null;
        if (img.startsWith("http")) return img;
        const apiBase = import.meta.env.VITE_API_BASE_URL || "https://localhost:7118/api";
        const hostBase = apiBase.replace(/\/api$/, "");
        return `${hostBase}/images/profiles/${img}`;
    };

    const imageUrl = getProfileImageUrl(profile?.profileImg);
    const initials =
        ((profile?.firstName?.charAt(0) || "") + (profile?.lastName?.charAt(0) || "")).toUpperCase() || "?";

    return (
        <PageContainer title="My Profile" description="Manage your personal account profile.">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Panel: Profile Image Card */}
                <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl !p-6 border border-slate-200 dark:border-slate-700 text-center flex flex-col items-center justify-center">
                    <div className="relative group">
                        <div className="h-32 w-32 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center overflow-hidden border-4 border-white shadow-md text-3xl font-extrabold">
                            {imageUrl ? (
                                <img src={imageUrl} alt="Profile" className="h-full w-full object-cover" />
                            ) : (
                                <span>{initials}</span>
                            )}
                        </div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={updateImageMutation.isPending}
                            className="absolute bottom-0 right-0 bg-blue-600 text-white !p-2 rounded-full shadow-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                            title="Upload new image"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
                    </div>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                    />

                    <h2 className="mt-4 text-xl font-bold text-slate-800 dark:text-slate-100">
                        {profile?.firstName} {profile?.lastName}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{profile?.email}</p>
                    <p className="mt-1 text-xs !px-2 !py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full font-medium">
                        @{profile?.userName}
                    </p>

                    {updateImageMutation.isPending && (
                        <p className="mt-2 text-xs text-blue-600 animate-pulse">Uploading image...</p>
                    )}

                    {imageError && <p className="mt-2 text-xs text-red-500">{imageError}</p>}
                </div>

                {/* Right Panel: Forms */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Profile Details Form */}
                    <div className="bg-white dark:bg-[#12141c] rounded-2xl !p-6 border border-slate-200 dark:border-slate-700/60 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 border-b border-slate-200 dark:border-slate-700 !pb-2">Profile Details</h3>

                        {profileSuccess && (
                            <div className="mb-4 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/50 rounded-lg !p-3 text-sm">
                                {profileSuccess}
                            </div>
                        )}

                        {profileError && (
                            <div className="mb-4 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/50 rounded-lg !p-3 text-sm">
                                {profileError}
                            </div>
                        )}

                        <form onSubmit={handleSubmitProfile(onProfileSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    label="First Name"
                                    error={profileErrors.firstName?.message}
                                    {...registerProfile("firstName")}
                                />
                                <Input
                                    label="Last Name"
                                    error={profileErrors.lastName?.message}
                                    {...registerProfile("lastName")}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Select
                                    label="Gender"
                                    options={[
                                        { label: "Male", value: 0 },
                                        { label: "Female", value: 1 },
                                    ]}
                                    error={profileErrors.gender?.message}
                                    {...registerProfile("gender", { valueAsNumber: true })}
                                />
                                <Input
                                    label="Date of Birth"
                                    type="date"
                                    error={profileErrors.dateOfBirth?.message}
                                    {...registerProfile("dateOfBirth")}
                                />
                            </div>

                            <Input
                                label="Phone Numbers (comma separated)"
                                placeholder="e.g. +123456789, +987654321"
                                error={profileErrors.phoneNumbers?.message}
                                {...registerProfile("phoneNumbers")}
                            />

                            <div className="flex justify-end !pt-2">
                                <Button type="submit" loading={updateProfileMutation.isPending}>
                                    Save Profile Details
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* Change Password Form */}
                    <div className="bg-white dark:bg-[#12141c] rounded-2xl !p-6 border border-slate-200 dark:border-slate-700/60 shadow-sm !mt-4">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 border-b border-slate-200 dark:border-slate-700 !pb-2">Change Password</h3>

                        {passwordSuccess && (
                            <div className="mb-4 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/50 rounded-lg !p-3 text-sm">
                                {passwordSuccess}
                            </div>
                        )}

                        {passwordError && (
                            <div className="mb-4 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/50 rounded-lg !p-3 text-sm">
                                {passwordError}
                            </div>
                        )}

                        <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="space-y-4">
                            <Input
                                label="Current Password"
                                type="password"
                                error={passwordErrors.currentPassword?.message}
                                {...registerPassword("currentPassword")}
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    label="New Password"
                                    type="password"
                                    error={passwordErrors.newPassword?.message}
                                    {...registerPassword("newPassword")}
                                />
                                <Input
                                    label="Confirm New Password"
                                    type="password"
                                    error={passwordErrors.confirmPassword?.message}
                                    {...registerPassword("confirmPassword")}
                                />
                            </div>

                            <div className="flex justify-end !pt-2">
                                <Button type="submit" loading={updatePasswordMutation.isPending}>
                                    Change Password
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
