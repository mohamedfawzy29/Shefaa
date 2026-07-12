using System;
using System.ComponentModel.DataAnnotations;

namespace Shefaa.DTOs.Request
{
    public class AddDoctorScheduleRequest
    {
        [Required(ErrorMessage = "Branch ID required")]
        public Guid BranchId { get; set; }

        [Required(ErrorMessage = "The day must be specified")]
        public DayOfWeek DayOfWeek { get; set; }

        [Required(ErrorMessage = "Start time required")]
        public TimeSpan StartTime { get; set; }

        [Required(ErrorMessage = "Completion time required")]
        public TimeSpan EndTime { get; set; }

        [Required(ErrorMessage = "Detection time in minutes is required")]
        [Range(5, 120, ErrorMessage = "The examination period should be between 5 and 120 minutes")]
        public int SlotDurationMinutes { get; set; }

        [Required(ErrorMessage = "Maximum number of patients required")]
        public int MaxPatients { get; set; }
    }
}