export interface ApplicationUserResponse {
    id: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    gender: number; // 0 = Male, 1 = Female
    dateOfBirth: string; // YYYY-MM-DD
    profileImg: string;
    phoneNumbers: string[];
}

export interface UpdateProfileRequest {
    firstName: string;
    lastName: string;
    gender: number;
    dateOfBirth: string;
    phoneNumbers: string[];
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}
