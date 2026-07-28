namespace Shefaa.Services
{
    public class DoctorService : IDoctorService
    {
        IRepository<Doctor> _doctorRepository;
        IRepository<Review> _reviewRepository;

        public DoctorService(IRepository<Doctor> doctorRepository, IRepository<Review> reviewRepository)
        {
            _doctorRepository = doctorRepository;
            _reviewRepository = reviewRepository;
        }

        public async Task UpdateDoctorAverageRatingAsync(Guid doctorId)
        {
            var doctor = await _doctorRepository.GetOneAsynch(
                d => d.DoctorId == doctorId);

            if (doctor == null)
                return;

            var reviews = await _reviewRepository.GetAsync(
                r => r.Appointment.DoctorId == doctorId,
                includes: [r => r.Appointment]);

            doctor.AverageRating = reviews.Any()
                ? reviews.Average(r => r.Rating)
                : 0;

            _doctorRepository.Update(doctor);
            await _doctorRepository.CommitChangesAsync();
        }
    }
}
