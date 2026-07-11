namespace Shefaa.Services
{
    public class ApplicationUserService : IApplicationUserService
    {
        IRepository<UserPhoneNumber> _userPhoneNumberRepository;

        public ApplicationUserService(IRepository<UserPhoneNumber> userPhoneNumberRepository)
        {
            _userPhoneNumberRepository = userPhoneNumberRepository;
        }

        public ApplicationUser CreateApplicationUser(string firstName, string lastName, string email, string userName, Gender gender, DateOnly dateOfBirth, string profileImage)
        {
            return new ApplicationUser
            {
                FirstName = firstName,
                LastName = lastName,
                Email = email,
                UserName = userName,
                Gender = gender,
                DateOfBirth = dateOfBirth,
                ProfileImg = profileImage,
                IsActive = true
            };
        }

        public async Task AddUserPhoneNumbersAsync(Guid userId, IEnumerable<string> phoneNumbers)
        {
            var numbers = phoneNumbers.Where(p => !string.IsNullOrWhiteSpace(p)).Select(p => p.Trim()).Distinct();
            foreach (var phoneNumber in numbers)
            {
                await _userPhoneNumberRepository.AddAsync(new UserPhoneNumber
                {
                    UserId = userId,
                    PhoneNumber = phoneNumber
                });
            }
            await _userPhoneNumberRepository.CommitChangesAsync();
        }
    }
}