namespace Shefaa.Services
{
    public interface IApplicationUserService
    {
        ApplicationUser CreateApplicationUser(string firstName, string lastName, string email, string userName, Gender gender, DateOnly dateOfBirth, string profileImage);
        Task AddUserPhoneNumbersAsync(Guid userId, IEnumerable<string> phoneNumbers);
    }
}
