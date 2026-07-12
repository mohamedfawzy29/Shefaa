using Shefaa.Models;
using System;

namespace Shefaa.DTOs.Response
{
    public class DoctorAppointmentResponse
    {
        public Guid AppointmentId { get; set; }
        public Guid PatientId { get; set; }
        public string PatientName { get; set; } = string.Empty;
        public string VisitReason { get; set; } = string.Empty;
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        public AppointmentStatus Status { get; set; }
        public string Notes { get; set; } = string.Empty;
        public string BranchName { get; set; } = string.Empty;
    }
}