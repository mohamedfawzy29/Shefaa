import { z } from "zod";

export const createOrganizationSchema = z.object({
    legalName: z.string().min(1, "Legal Name is required").max(200, "Name is too long"),
    taxNumber: z.string().min(1, "Tax Number is required").max(50, "Tax Number is too long"),
    commercialRegistrationNumber: z.string().optional(),
    mainEmail: z.string().email("Invalid email address").min(1, "Main Email is required"),
    mainPhone: z.string().min(1, "Main Phone is required"),
    logoImg: z.string().optional(),
    websiteUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
    status: z.string(),
});

export type CreateOrganizationFormData = z.infer<typeof createOrganizationSchema>;

export const editOrganizationSchema = z.object({
    legalName: z.string().min(1, "Legal Name is required").max(200, "Name is too long"),
    taxNumber: z.string().min(1, "Tax Number is required").max(50, "Tax Number is too long"),
    commercialRegistrationNumber: z.string().optional(),
    mainEmail: z.string().email("Invalid email address").min(1, "Main Email is required"),
    mainPhone: z.string().min(1, "Main Phone is required"),
    logoImg: z.string().optional(),
    websiteUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
    status: z.string(),
});

export type EditOrganizationFormData = z.infer<typeof editOrganizationSchema>;
