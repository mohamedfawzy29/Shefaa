
namespace Shefaa.Models
{
    public class MedicalRecord
    {
        public Guid Id { get; set; }
        
        [MaxLength(500)]
        public string DoctorNotes { get; set; } = string.Empty;
        
        [MaxLength(200)]
        public string ChiefComplaint { get; set; } = string.Empty;
        
        [MaxLength(300)]
        public string Diagnosis { get; set; } = string.Empty;

        [MaxLength(500)]
        public string TreatmentPlan { get; set; } = string.Empty;
        public DateTime? FollowUpDate { get; set; }
        public Guid AppointmentId { get; set; }
        public Appointment Appointment { get; set; } = null!;
        public Guid PatientId { get; set; }
        public Patient Patient { get; set; }
        public Guid DoctorId { get; set; }
        public Doctor Doctor { get; set; }
    }   
}
