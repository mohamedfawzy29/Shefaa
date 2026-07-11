namespace Shefaa.DTOs.Response
{
    public class ReceptionistResponse
    {
        public Guid ReceptionistId { get; set; }
        public Guid UserId { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public List<string> PhoneNumbers { get; set; } = new();
        public string BranchName { get; set; } = string.Empty;
        public string? ProfileImageUrl { get; set; }
        public ReceptionistStatus Status { get; set; }
    }
}