using System;
using System.ComponentModel.DataAnnotations;

namespace Shefaa.DTOs.Request
{
    public class CreateMedicalRecordRequest
    {
        [Required(ErrorMessage = "Appointment ID is required.")]
        public Guid AppointmentId { get; set; }

        [MaxLength(200, ErrorMessage = "Chief complaint cannot exceed 200 characters.")]
        public string ChiefComplaint { get; set; } = string.Empty;

        [Required(ErrorMessage = "Diagnosis is required.")]
        [MaxLength(300, ErrorMessage = "Diagnosis cannot exceed 300 characters.")]
        public string Diagnosis { get; set; } = string.Empty;

        [MaxLength(500, ErrorMessage = "Treatment plan cannot exceed 500 characters.")]
        public string TreatmentPlan { get; set; } = string.Empty;

        [MaxLength(500, ErrorMessage = "Doctor notes cannot exceed 500 characters.")]
        public string DoctorNotes { get; set; } = string.Empty;

        public DateTime? FollowUpDate { get; set; }
    }
}