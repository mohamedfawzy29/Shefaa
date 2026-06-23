using Shefaa.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Shefaa.Model
{
    public class Doctor
    {
        [Key]
        public int DoctorId { get; set; }

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

        // Foreign Keys
        [Required]
        public int UserId { get; set; }

        [Required]
        public int SpecializationId { get; set; }

        // Navigation Properties
        [ForeignKey("UserId")]
        public User User { get; set; }

        [ForeignKey("SpecializationId")]
        public Specialization Specialization { get; set; }

        public ICollection<DoctorSchedule> DoctorSchedules { get; set; } = new List<DoctorSchedule>();
    }
}