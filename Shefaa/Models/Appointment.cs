
namespace Shefaa.Models
{
    public enum AppointmentStatus
    {
        Scheduled = 0,
        Completed = 1,
        Cancelled = 2,
        CheckedIn = 3,
        NoShow = 4
    }
    public class Appointment
    {
        public Guid Id { get; set; }
        [MaxLength(300)]
        public string VisitReason { get; set; } = string.Empty;
        public DateOnly AppointmentDate { get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        [MaxLength(500)]
        public string Notes { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime? CancelledAt { get; set; }
        public AppointmentStatus Status { get; set; }
        public Guid PatientId { get; set; }
        public Patient Patient { get; set; }
        public Guid DoctorId { get; set; }
        public Doctor Doctor { get; set; }
        public Guid BranchId { get; set; }
        public Branch Branch { get; set; }
        public MedicalRecord? MedicalRecord { get; set; }
        public Review? Review { get; set; }
    }
}
