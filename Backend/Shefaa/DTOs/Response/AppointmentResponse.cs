namespace Shefaa.DTOs.Response
{
    public class AppointmentResponse
    {
        public Guid AppointmentId { get; set; }
        public string PatientName { get; set; } = string.Empty;
        public string DoctorName { get; set; } = string.Empty;
        public string BranchName { get; set; } = string.Empty;
        public DateOnly AppointmentDate { get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        public string VisitReason { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        public AppointmentStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime? CancelledAt { get; set; }
    }
}