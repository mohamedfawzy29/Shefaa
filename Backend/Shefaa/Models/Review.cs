
namespace Shefaa.Models
{
    public class Review
    {
        public Guid Id { get; set; }
        [MaxLength(200)]
        public string Comment { get; set; }
        public int Rating { get; set; }
        public DateTime CreatedAt { get; set; }
        public Guid PatientId { get; set; }
        public Patient Patient { get; set; }
        public Guid AppointmentId { get; set; }
        public Appointment Appointment { get; set; }
    }
}
