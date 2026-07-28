import { useMutation, useQueryClient } from "@tanstack/react-query";
import { doctorMedicalService } from "../services/doctorMedicalService";
import { DOCTOR_CLINIC_QUERY_KEYS } from "../../doctor-clinic/hooks/useDoctorClinic";
import type { CreateMedicalRecordRequest } from "../types/doctorMedical";

export function useCreatePrescription() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: CreateMedicalRecordRequest) =>
            doctorMedicalService.createPrescription(request),
        onSuccess: () => {
            // Automatically refresh Doctor's Today's Appointments & practice stats
            queryClient.invalidateQueries({ queryKey: DOCTOR_CLINIC_QUERY_KEYS.todayAppointments });
        },
    });
}
