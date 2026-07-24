namespace Shefaa.DTOs.Response
{
    /// <summary>
    /// Safe public-facing doctor DTO — no PII (no email, phone, license number).
    /// Returned by the [AllowAnonymous] GET actions in Patient/DoctorController
    /// and consumed by public pages (HomePage, PublicDoctorsPage, PublicDoctorDetailPage).
    /// </summary>
    public class PublicDoctorResponse
    {
        public Guid   DoctorId           { get; set; }
        public string FirstName          { get; set; } = string.Empty;
        public string LastName           { get; set; } = string.Empty;
        public string ProfileImageUrl    { get; set; } = string.Empty;
        public string Specialization     { get; set; } = string.Empty;
        public string Bio                { get; set; } = string.Empty;
        public int    YearsOfExperience  { get; set; }
        public double AverageRating      { get; set; }
        public DoctorStatus Status       { get; set; }

        /// <summary>
        /// Included on the detail endpoint only — used by the booking modal
        /// to generate available time slots per branch/day.
        /// </summary>
        public IEnumerable<PublicScheduleResponse> DoctorSchedules { get; set; }
            = Enumerable.Empty<PublicScheduleResponse>();
    }

    /// <summary>
    /// Safe schedule DTO — only fields the patient needs to compute time slots.
    /// </summary>
    public class PublicScheduleResponse
    {
        public Guid      Id                   { get; set; }
        public Guid      BranchId             { get; set; }
        public DayOfWeek DayOfWeek            { get; set; }
        public TimeSpan  StartTime            { get; set; }
        public TimeSpan  EndTime              { get; set; }
        public int       SlotDurationMinutes  { get; set; }
        public int       MaxPatients          { get; set; }
        public bool      IsActive             { get; set; }
    }
}
