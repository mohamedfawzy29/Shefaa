import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

/**
 * Optional File validation compatible with Zod v4.
 *
 * z.instanceof(File).optional() in Zod v4 still runs refinements against the
 * value before the optional short-circuit fires, causing runtime errors when
 * the field is undefined.  The correct pattern is to wrap with z.optional()
 * at the top level so undefined is accepted without touching the inner schema.
 */
const iconValidation = z
    .instanceof(File)
    .refine((f) => f.size <= MAX_FILE_SIZE, "Image must be smaller than 5 MB")
    .refine(
        (f) => ACCEPTED_IMAGE_TYPES.includes(f.type),
        "Only .jpg, .jpeg, .png, and .webp files are accepted"
    )
    .optional();

/**
 * Create specialization:
 *   - name        required
 *   - description optional
 *   - icon        optional File
 */
export const createSpecializationSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name is too long"),
    description: z.string().max(500, "Description is too long").optional(),
    icon: iconValidation,
});

export type CreateSpecializationFormData = z.infer<typeof createSpecializationSchema>;

/**
 * Edit specialization:
 *   - description optional
 *   - icon        optional File
 *
 *   Name is NOT editable — backend PUT does not accept it.
 */
export const editSpecializationSchema = z.object({
    description: z.string().max(500, "Description is too long").optional(),
    icon: iconValidation,
});

export type EditSpecializationFormData = z.infer<typeof editSpecializationSchema>;
