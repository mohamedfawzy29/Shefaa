
namespace Shefaa.Models
{
    [PrimaryKey(nameof(DayOfWeek), nameof(StartTime), nameof(DoctorId), nameof(BranchId))]
    public class DoctorSchedule
    {

        [Required]
        public DayOfWeek DayOfWeek { get; set; } 

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

        [Required]
        public Guid BranchId { get; set; }

        [Required]
        public Guid DoctorId { get; set; }

        [ForeignKey("DoctorId")]
        public Doctor Doctor { get; set; }


    }
}
