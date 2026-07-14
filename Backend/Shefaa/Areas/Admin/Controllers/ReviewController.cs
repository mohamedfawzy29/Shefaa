using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Shefaa.Services;

namespace Shefaa.Areas.Admin.Controllers
{
    [Area(CD.ADMIN_AREA)]
    [Route("api/[controller]")]
    [Authorize(Roles = CD.ADMIN_ROLE)]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        IRepository<Review> _reviewRepository;
        IDoctorService _doctorService;

        public ReviewController(IRepository<Review> reviewRepository, IDoctorService doctorService)
        {
            _reviewRepository = reviewRepository;
            _doctorService = doctorService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllReviews()
        {
            var reviews = await _reviewRepository.GetAsync(includes: [r => r.Patient, r => r.Patient.User, r => r.Appointment, r => r.Appointment.Doctor, r => r.Appointment.Doctor.User]);
            var response = new List<ReviewResponse>();

            foreach (var review in reviews)
            {
                response.Add(new ReviewResponse
                {
                    ReviewId = review.Id,
                    AppointmentId = review.AppointmentId,
                    PatientName = $"{review.Patient.User.FirstName} {review.Patient.User.LastName}",
                    DoctorName = $"{review.Appointment.Doctor.User.FirstName} {review.Appointment.Doctor.User.LastName}",
                    Rating = review.Rating,
                    Comment = review.Comment,
                    CreatedAt = review.CreatedAt
                });
            }

            return Ok(new ApiResponse<List<ReviewResponse>>
            {
                IsSuccess = true,
                Message = "Reviews retrieved successfully.",
                Data = response
            });
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetReviewById(Guid id)
        {
            var review = await _reviewRepository.GetOneAsynch(r => r.Id == id, includes: [r => r.Patient, r => r.Patient.User, r => r.Appointment, r => r.Appointment.Doctor, r => r.Appointment.Doctor.User]);

            if (review == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Review not found."
                });
            }

            var response = new ReviewResponse
            {
                ReviewId = review.Id,
                AppointmentId = review.AppointmentId,
                PatientName = $"{review.Patient.User.FirstName} {review.Patient.User.LastName}",
                DoctorName = $"{review.Appointment.Doctor.User.FirstName} {review.Appointment.Doctor.User.LastName}",
                Rating = review.Rating,
                Comment = review.Comment,
                CreatedAt = review.CreatedAt
            };

            return Ok(new ApiResponse<ReviewResponse>
            {
                IsSuccess = true,
                Message = "Review retrieved successfully.",
                Data = response
            });
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteReview(Guid id)
        {
            var review = await _reviewRepository.GetOneAsynch(r => r.Id == id, includes: [r => r.Appointment]);

            if (review == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Review not found."
                });
            }

            var doctorId = review.Appointment.DoctorId;

            _reviewRepository.Delete(review);
            await _reviewRepository.CommitChangesAsync();

            await _doctorService.UpdateDoctorAverageRatingAsync(doctorId);

            return Ok(new ApiResponse<object>
            {
                IsSuccess = true,
                Message = "Review deleted successfully."
            });
        }
    }
}
