namespace Shefaa.Services
{
    public interface IDoctorService
    {
        Task UpdateDoctorAverageRatingAsync(Guid doctorId);
    }
}
