using Shefaa.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Shefaa.Models
{
    public class Patient
    {
        [Key]
        public int PatientId { get; set; }

        [MaxLength(255)]
        public string? Address { get; set; }

        [MaxLength(50)]
        public string? NationalId { get; set; }

        [MaxLength(20)]
        public string? EmergencyContact { get; set; }

        [MaxLength(5)]
        public string? BloodType { get; set; }

        // Foreign Key
        [Required]
        public int UserId { get; set; }

        // Navigation Property
        [ForeignKey("UserId")]
        public User User { get; set; }
    }
}