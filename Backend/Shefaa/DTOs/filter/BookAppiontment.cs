namespace Shefaa.DTOs.filter
{
    public class BookAppiontment
    {
        public Guid DoctorId { get; set; }
        public Guid BranchId { get; set; }
        public DateOnly AppointmentDate { get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        public string VisitReason { get; set; } = string.Empty;
    }

}
