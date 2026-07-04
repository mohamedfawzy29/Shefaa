namespace Shefaa.DTOs.Request
{
    using System.ComponentModel.DataAnnotations;

    namespace Shefaa.DTOs.Request
    {
        public class UpdateProfileRequest
        {
            [Required(ErrorMessage = "First name required")]
            [MaxLength(50)]
            public string FirstName { get; set; } = string.Empty;

            [Required(ErrorMessage = "Last name required")]
            [MaxLength(50)]
            public string LastName { get; set; } = string.Empty;

            public Gender Gender { get; set; } = Gender.Male;

            public DateOnly DateOfBirth { get; set; }
        }
    }
}
