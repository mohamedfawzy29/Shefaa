namespace Shefaa.DTOs.filter
{
    public class AddReview
    {
        [Required]
        public Guid DoctorId { get; set; }

        [Required]
        public Guid AppointmentId { get; set; } 

        [Required]
        [Range(1, 5, ErrorMessage = "Rate from 1 to 5")]
        public int Rating { get; set; } 

        public string Comment { get; set; } = string.Empty;
    }
}
