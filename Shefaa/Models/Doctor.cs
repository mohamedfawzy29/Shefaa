using Shefaa.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Shefaa.Models
{
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
        public string Status { get; set; }

        [Required]
        public Guid UserId { get; set; }

        [Required]
        public Guid SpecializationId { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; }

        [ForeignKey("SpecializationId")]
        public Specialization Specialization { get; set; }

        public ICollection<DoctorSchedule> DoctorSchedules { get; set; } = new List<DoctorSchedule>();
        public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
        public ICollection<DoctorBranche> DoctorBranches { get; set; } = new List<DoctorBranche>();
        public ICollection<MedicalRecord> MedicalRecords { get; set; } = new List<MedicalRecord>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}