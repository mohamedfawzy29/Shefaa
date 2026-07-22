import { z } from "zod";

export const createBranchSchema = z.object({
    branchName: z.string().min(1, "Branch Name is required"),
    branchEmail: z.string().email("Invalid email address").min(1, "Branch Email is required"),
    country: z.string(),
    city: z.string().min(1, "City is required"),
    governorate: z.string().min(1, "Governorate is required"),
    address: z.string().min(1, "Address is required"),
    isActive: z.boolean(),
    organizationId: z.string().uuid("Invalid Organization ID").min(1, "Organization is required"),
});

export type CreateBranchFormData = z.infer<typeof createBranchSchema>;

export const editBranchSchema = z.object({
    branchName: z.string().min(1, "Branch Name is required"),
    branchEmail: z.string().email("Invalid email address").min(1, "Branch Email is required"),
    country: z.string(),
    city: z.string().min(1, "City is required"),
    governorate: z.string().min(1, "Governorate is required"),
    address: z.string().min(1, "Address is required"),
    isActive: z.boolean(),
    organizationId: z.string().uuid("Invalid Organization ID").min(1, "Organization is required"),
});

export type EditBranchFormData = z.infer<typeof editBranchSchema>;
