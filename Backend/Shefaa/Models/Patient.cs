
namespace Shefaa.Models
{
    public class Patient
    {
        [Key]
        public Guid PatientId { get; set; }
        [MaxLength(255)]
        public string? Address { get; set; }
        [MaxLength(50)]
        public string? NationalId { get; set; }
        [MaxLength(20)]
        public string? EmergencyContact { get; set; }
        [MaxLength(5)]
        public string? BloodType { get; set; }
        [Required]
        public Guid UserId { get; set; }
        [ForeignKey("UserId")]
        public ApplicationUser User { get; set; }
        public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
        public ICollection<MedicalRecord> MedicalRecords { get; set; } = new List<MedicalRecord>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}