using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Shefaa.Models
{
    public class DoctorSchedule
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public DayOfWeek DayOfWeek { get; set; } // يفضل استخدام Enum لـ DayOfWeek في C#

        [Required]
        [DataType(DataType.Time)]
        public TimeSpan StartTime { get; set; }

        [Required]
        [DataType(DataType.Time)]
        public TimeSpan EndTime { get; set; }

        [Required]
        public int SlotDurationMinutes { get; set; }

        [Required]
        public int MaxPatients { get; set; }

        public bool IsActive { get; set; } = true;

        // Foreign Keys
        [Required]
        public Guid BranchId { get; set; }

        [Required]
        public Guid DoctorId { get; set; }

        // Navigation Properties
        [ForeignKey("DoctorId")]
        public Doctor Doctor { get; set; }


    }
}
