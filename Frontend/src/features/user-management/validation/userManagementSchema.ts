import { z } from "zod";

/**
 * Backend AssignRolesRequest:
 *   - UserId: Guid (required)
 *   - Roles:  List<string> (required, at least one)
 *
 * Available system roles are fixed on the backend side.
 * The form collects a single role per user (UI convenience) and wraps
 * it in an array before sending — matching the backend contract.
 */
export const assignRolesSchema = z.object({
    role: z.string().min(1, "Please select a role"),
});

export type AssignRolesFormData = z.infer<typeof assignRolesSchema>;
