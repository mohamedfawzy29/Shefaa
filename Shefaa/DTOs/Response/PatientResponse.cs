namespace Shefaa.DTOs.Response
{
    public class PatientResponse
    {
        public Guid PatientId { get; set; }
        public Guid UserId { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public List<string> PhoneNumbers { get; set; } = new();
        public string? Address { get; set; }
        public string? NationalId { get; set; }
        public string? EmergencyContact { get; set; }
        public string? BloodType { get; set; }
        public string? ProfileImageUrl { get; set; }
        public bool IsActive { get; set; }
        public bool IsLockedOut { get; set; }
    }
}