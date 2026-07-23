using Microsoft.AspNetCore.Http;

namespace Shefaa.Services
{
    public interface IFileService
    {
        Task<string> UploadProfileImageAsync(IFormFile? file);
        Task DeleteProfileImageAsync(string? fileName);

        Task<string> UploadImageAsync(IFormFile? file, string folder, string defaultImage = "default.png");

        Task DeleteImageAsync(string? fileName, string folder);
    }
}