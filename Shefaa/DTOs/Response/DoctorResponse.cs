namespace Shefaa.DTOs.Response
{
    public class DoctorResponse
    {
        public Guid DoctorId { get; set; }
        public Guid UserId { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public List<string> PhoneNumbers { get; set; } = new();
        public string ProfileImageUrl { get; set; } = string.Empty;
        public string Specialization { get; set; } = string.Empty;
        public string LicenseNumber { get; set; } = string.Empty;
        public int YearsOfExperience { get; set; }
        public double AverageRating { get; set; }
        public DoctorStatus Status { get; set; }
    }
}