public class UserResponse
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string ProfileImageUrl { get; set; } = string.Empty;
    public bool IsLockedOut { get; set; }
    public bool IsActive { get; set; }
    public ICollection<UserPhoneNumber> PhoneNumbers { get; set; } = new List<UserPhoneNumber>();
}