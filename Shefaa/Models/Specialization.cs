using System.ComponentModel.DataAnnotations;

namespace Shefaa.Model
{
    public class Specialization
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [MaxLength(500)]
        public string? Description { get; set; }

        [MaxLength(255)]
        public string? IconImg { get; set; }

        // Navigation Properties
        public ICollection<Doctor> Doctors { get; set; } = new List<Doctor>();
    }
}
