namespace Shefaa.DTOs.Response
{
    public class ReviewResponse
    {
        public Guid ReviewId { get; set; }
        public Guid AppointmentId { get; set; }
        public string PatientName { get; set; } = string.Empty;
        public string DoctorName { get; set; } = string.Empty;
        [Range(0, 5)]
        public int Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}