namespace Shefaa.DTOs.Request
{
    public class CreateReceptionistByAdminRequest
    {
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        public string UserName { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        public Gender Gender { get; set; }
        [Required]
        public DateOnly DateOfBirth { get; set; }
        [Required]
        public Guid BranchId { get; set; }
        [Required]
        [MinLength(1)]
        public List<string> PhoneNumbers { get; set; } = new();
        public IFormFile? ProfileImg { get; set; }
    }
}
