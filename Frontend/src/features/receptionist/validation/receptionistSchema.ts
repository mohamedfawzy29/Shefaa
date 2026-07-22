import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const iconValidation = z
    .instanceof(File)
    .refine((f) => f.size <= MAX_FILE_SIZE, "Image must be smaller than 5 MB")
    .refine(
        (f) => ACCEPTED_IMAGE_TYPES.includes(f.type),
        "Only .jpg, .jpeg, .png, and .webp files are accepted"
    )
    .optional();

export const createReceptionistSchema = z.object({
    firstName: z.string().min(1, "First Name is required"),
    lastName: z.string().min(1, "Last Name is required"),
    email: z.string().email("Invalid email").min(1, "Email is required"),
    userName: z.string().min(1, "Username is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    gender: z.string().min(1, "Gender is required"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    branchId: z.string().uuid("Invalid branch ID").min(1, "Branch is required"),
    phoneNumbers: z.string().min(1, "At least one phone number is required"), // will split by comma
    profileImg: iconValidation,
});

export type CreateReceptionistFormData = z.infer<typeof createReceptionistSchema>;
