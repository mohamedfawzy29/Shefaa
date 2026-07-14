
namespace Shefaa.Services
{
    public class FileService : IFileService
    {
        private readonly IWebHostEnvironment _environment;

        public FileService(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        public async Task<string> UploadProfileImageAsync(IFormFile? file)
        {
            if (file == null || file.Length == 0)
                return "default.png";

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };

            var extension = Path.GetExtension(file.FileName).ToLower();

            if (!allowedExtensions.Contains(extension))
            {
                throw new InvalidOperationException("Only image files are allowed.");
            }

            const long maxSize = 5 * 1024 * 1024; // 5 MB

            if (file.Length > maxSize)
            {
                throw new InvalidOperationException("Image size must not exceed 5 MB.");
            }

            var uploadsFolder = Path.Combine(_environment.WebRootPath,"images","profiles");

            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var originalFileName = Path.GetFileNameWithoutExtension(file.FileName);

            originalFileName = originalFileName.Replace(" ", "_");

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

        public Task DeleteProfileImageAsync(string? fileName)
        {
            if (string.IsNullOrWhiteSpace(fileName) || fileName == "default.png")
                return Task.CompletedTask;

            var filePath = Path.Combine(
                _environment.WebRootPath,
                "images",
                "profiles",
                fileName);

            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }

            return Task.CompletedTask;
        }
    }
}
