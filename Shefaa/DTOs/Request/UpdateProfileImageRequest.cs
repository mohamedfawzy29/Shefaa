namespace Shefaa.DTOs.Request
{
    public class UpdateProfileImageRequest
    {
        [Required]
        public IFormFile ProfileImage { get; set; } = default!;
    }
}
