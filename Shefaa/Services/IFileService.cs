namespace Shefaa.Services
{
    public interface IFileService
    {
        Task<string> UploadProfileImageAsync(IFormFile? file);
        Task DeleteProfileImageAsync(string? fileName);
    }
}
