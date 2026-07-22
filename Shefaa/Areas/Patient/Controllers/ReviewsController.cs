using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Shefaa.Repositories;
using System.Security.Claims;
using Shefaa.DTOs.filter;
namespace Shefaa.Areas.Patient.Controllers
{
    [Area(CD.PATIENT_AREA)]
    [Route("api/Patient/[controller]")]
    [Authorize(Roles = CD.PATIENT_ROLE)]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly IRepository<Review> _reviewRepo;
        private readonly IRepository<Shefaa.Models.Patient> _patientRepo;
        private readonly IRepository<Appointment> _appointmentRepo;

        public ReviewsController(
            IRepository<Review> reviewRepo,
            IRepository<Shefaa.Models.Patient> patientRepo,
            IRepository<Appointment> appointmentRepo)
        {
            _reviewRepo = reviewRepo;
            _patientRepo = patientRepo;
            _appointmentRepo = appointmentRepo;
        }

        
        private async Task<Guid?> GetCurrentPatientIdAsync()
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr)) return null;

            Guid userGuid = Guid.Parse(userIdStr);
            var patient = await _patientRepo.GetOneAsynch(p => p.UserId == userGuid);
            return patient?.PatientId;
        }

        
        [HttpPost("add")]
        public async Task<IActionResult> AddReview([FromBody] AddReview dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "DATA NOT CORRECT",
                    Errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)
                });
            }

            var patientId = await GetCurrentPatientIdAsync();
            if (patientId == null) return Unauthorized();

           
            var completedAppointment = await _appointmentRepo.GetOneAsynch(a =>
                a.Id == dto.AppointmentId &&
                a.PatientId == patientId &&
                a.Status == AppointmentStatus.Completed
            );

            if (completedAppointment == null)
            {
                return BadRequest(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "BOOK APPIONT FIRST"
                });
            }

          
            var existingReview = await _reviewRepo.GetOneAsynch(r => r.AppointmentId == dto.AppointmentId);
            if (existingReview != null)
            {
                return BadRequest(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "YOU DO REVIEW "
                });
            }

           
            var newReview = new Review
            {
                Id = Guid.NewGuid(),
                PatientId = patientId.Value,
                AppointmentId = dto.AppointmentId,
                Rating = dto.Rating,
                Comment = dto.Comment,
                CreatedAt = DateTime.UtcNow
            };

            await _reviewRepo.AddAsync(newReview);
            await _reviewRepo.CommitChangesAsync();

            return Ok(new ApiResponse<object>
            {
                IsSuccess = true,
                Message = "YOUR REVIEW DONE SUCCCESSFULL"
            });
        }

        
        [HttpGet("my-reviews")]
        public async Task<IActionResult> GetMyReviews()
        {
            var patientId = await GetCurrentPatientIdAsync();
            if (patientId == null) return Unauthorized();

            var reviews = await _reviewRepo.GetAsync(
                filter: r => r.PatientId == patientId,
                includes: new System.Linq.Expressions.Expression<Func<Review, object>>[]
                {
                    r => r.Appointment,
                    r => r.Appointment.Doctor,
                    r => r.Appointment.Doctor.User
                }
            );

            return Ok(new ApiResponse<IEnumerable<Review>>
            {
                IsSuccess = true,
                Message = "REVIEWS DONE SUCCCESSFULL",
                Data = reviews
            });
        }

        
        [HttpPut("update/{reviewId}")]
        public async Task<IActionResult> UpdateReview(Guid reviewId, [FromBody] UpdateReviewDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "DATA UN ACCESS",
                    Errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)
                });
            }

            var patientId = await GetCurrentPatientIdAsync();
            if (patientId == null) return Unauthorized();

            var review = await _reviewRepo.GetOneAsynch(r => r.Id == reviewId && r.PatientId == patientId);
            if (review == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "REVIEW NOT FOUND"
                });
            }

            review.Rating = dto.Rating;
            review.Comment = dto.Comment;

            _reviewRepo.Update(review);
            await _reviewRepo.CommitChangesAsync();

            return Ok(new ApiResponse<object>
            {
                IsSuccess = true,
                Message = "REVIEW UPDATED SUCCESSFULLY"
            });
        }

        
        [HttpDelete("delete/{reviewId}")]
        public async Task<IActionResult> DeleteReview(Guid reviewId)
        {
            var patientId = await GetCurrentPatientIdAsync();
            if (patientId == null) return Unauthorized();

            var review = await _reviewRepo.GetOneAsynch(r => r.Id == reviewId && r.PatientId == patientId);
            if (review == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "REVIEW NOT FOUND "
                });
            }

            _reviewRepo.Delete(review);
            await _reviewRepo.CommitChangesAsync();

            return Ok(new ApiResponse<object>
            {
                IsSuccess = true,
                Message = "DELLET SUCCESS"
            });
        }

        
        [AllowAnonymous]
        [HttpGet("doctor/{doctorId}")]
        public async Task<IActionResult> GetDoctorReviews(Guid doctorId)
        {
            var reviews = await _reviewRepo.GetAsync(
                filter: r => r.Appointment.DoctorId == doctorId,
                includes: new System.Linq.Expressions.Expression<Func<Review, object>>[]
                {
                    r => r.Patient,
                    r => r.Patient.User,
                    r => r.Appointment
                }
            );

            return Ok(new ApiResponse<IEnumerable<Review>>
            {
                IsSuccess = true,
                Message = "ALL REVIW OF DOCTOR",
                Data = reviews
            });
        }
    }

    
    public class UpdateReviewDto
    {
        [System.ComponentModel.DataAnnotations.Required]
        [System.ComponentModel.DataAnnotations.Range(1, 5, ErrorMessage = "Rate from 1 to 5")]
        public int Rating { get; set; }
        public string Comment { get; set; } = string.Empty;

    }
}
