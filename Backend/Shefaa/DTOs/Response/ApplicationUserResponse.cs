namespace Shefaa.DTOs.Response
{
    public class ApplicationUserResponse
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public Gender Gender { get; set; }
        public DateOnly DateOfBirth { get; set; }
        public string ProfileImg { get; set; } = string.Empty;
        public List<string> PhoneNumbers { get; set; } = [];
    }
}
