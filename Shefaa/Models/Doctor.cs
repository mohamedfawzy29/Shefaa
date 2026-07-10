
namespace Shefaa.Models
{
    public enum DoctorStatus
    {
        Pending,
        Approved,
        Rejected,
        Suspended
    }
    public class Doctor
    {
        [Key]
        public Guid DoctorId { get; set; }
        [Required]
        public string Bio { get; set; }
        [Required]
        public int YearsOfExperience { get; set; }
        [Required]
        [MaxLength(50)]
        public string LicenseNumber { get; set; }
        public double AverageRating { get; set; }
        [Required]
        public DoctorStatus Status { get; set; } = DoctorStatus.Pending;
        [Required]
        public Guid UserId { get; set; }
        [Required]
        public Guid SpecializationId { get; set; }
        [ForeignKey("UserId")]
        public ApplicationUser User { get; set; }
        [ForeignKey("SpecializationId")]
        public Specialization Specialization { get; set; }
        public ICollection<DoctorSchedule> DoctorSchedules { get; set; } = new List<DoctorSchedule>();
        public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
        public ICollection<DoctorBranch> DoctorBranches { get; set; } = new List<DoctorBranch>();
        public ICollection<MedicalRecord> MedicalRecords { get; set; } = new List<MedicalRecord>();
    }
}