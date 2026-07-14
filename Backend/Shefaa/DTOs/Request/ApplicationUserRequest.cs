namespace Shefaa.DTOs.Request
{
    public class ApplicationUserRequest
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }
        public Gender Gender { get; set; } = Gender.Male;
        public DateOnly DateOfBirth { get; set; }
        public string? ProfileImg { get; set; }
        [DataType(DataType.Password)]
        public string? CurrentPassword { get; set; }
        [DataType(DataType.Password)]

        public string? NewPassword { get; set; }

    }
}
