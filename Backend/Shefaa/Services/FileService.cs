using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace Shefaa.Services
{
    public class FileService : IFileService
    {
        private readonly IWebHostEnvironment _environment;

        public FileService(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        public async Task<string> UploadImageAsync(IFormFile? file, string folder, string defaultImage = "default.png")
        {
            if (file == null || file.Length == 0)
                return defaultImage;

            var allowedExtensions = new[]
            {
                ".jpg",
                ".jpeg",
                ".png",
                ".webp",
                ".svg"
            };

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

            if (!allowedExtensions.Contains(extension))
            {
                throw new InvalidOperationException("Only image files are allowed.");
            }

            const long maxSize = 5 * 1024 * 1024;

            if (file.Length > maxSize)
            {
                throw new InvalidOperationException("Image size must not exceed 5 MB.");
            }

            var uploadsFolder = Path.Combine(_environment.WebRootPath,"images",folder);

            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var originalFileName = Path.GetFileNameWithoutExtension(file.FileName).Replace(" ", "_");

            var fileName = $"{Guid.NewGuid()}_{originalFileName}{extension}";

            var filePath = Path.Combine(uploadsFolder, fileName);

            try
            {
                using var stream = new FileStream(filePath, FileMode.Create);

                await file.CopyToAsync(stream);

                return fileName;
            }
            catch
            {
                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                }

                throw;
            }
        }

        public Task<string> UploadProfileImageAsync(IFormFile? file)
        {
            return UploadImageAsync(file, "profiles");
        }

        public Task DeleteImageAsync(string? fileName, string folder)
        {
            if (string.IsNullOrWhiteSpace(fileName) || fileName == "default.png")
            {
                return Task.CompletedTask;
            }

            var filePath = Path.Combine(_environment.WebRootPath, "images", folder, fileName);

            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }

            return Task.CompletedTask;
        }

        public Task DeleteProfileImageAsync(string? fileName)
        {
            return DeleteImageAsync(fileName, "profiles");
        }
    }
}