namespace Shefaa.Models
{
    public class MedicalRecord
    {
        public Guid Id { get; set; }
        public string DoctorNotes { get; set; }
        public string ChiefComplaint { get; set; }
        public string Diagnosis { get; set; }
        public string TreatmentPlan { get; set; }
        public DateTime? FollowUpDate { get; set; }
        public Guid AppointmentId { get; set; }
        public Appointment Appointment { get; set; }
        public Guid PatientId { get; set; }
        public Patient Patient { get; set; }
        public Guid DoctorId { get; set; }
        public Doctor Doctor { get; set; }
    }   
}
