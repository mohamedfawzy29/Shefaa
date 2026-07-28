<<<<<<< HEAD
﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Shefaa.Repositories;
=======
>>>>>>> 230c220864a825afec575f0000ab00412668c75f
using System.Security.Claims;
using Shefaa.DTOs.filter;
namespace Shefaa.Areas.Patient.Controllers
{
    [Area(CD.PATIENT_AREA)]
<<<<<<< HEAD
    [Route("api/Patient/[controller]")]
=======
    [Route("api/[area]/[controller]")]
>>>>>>> 230c220864a825afec575f0000ab00412668c75f
    [Authorize(Roles = CD.PATIENT_ROLE)]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly IRepository<Review> _reviewRepo;
        private readonly IRepository<Shefaa.Models.Patient> _patientRepo;
        private readonly IRepository<Appointment> _appointmentRepo;
<<<<<<< HEAD
=======
        private readonly IDoctorService _doctorService;
>>>>>>> 230c220864a825afec575f0000ab00412668c75f

        public ReviewsController(
            IRepository<Review> reviewRepo,
            IRepository<Shefaa.Models.Patient> patientRepo,
<<<<<<< HEAD
            IRepository<Appointment> appointmentRepo)
=======
            IRepository<Appointment> appointmentRepo,
            IDoctorService doctorService)
>>>>>>> 230c220864a825afec575f0000ab00412668c75f
        {
            _reviewRepo = reviewRepo;
            _patientRepo = patientRepo;
            _appointmentRepo = appointmentRepo;
<<<<<<< HEAD
        }

        
=======
            _doctorService = doctorService;
        }


>>>>>>> 230c220864a825afec575f0000ab00412668c75f
        private async Task<Guid?> GetCurrentPatientIdAsync()
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr)) return null;

            Guid userGuid = Guid.Parse(userIdStr);
            var patient = await _patientRepo.GetOneAsynch(p => p.UserId == userGuid);
            return patient?.PatientId;
        }

<<<<<<< HEAD
        
=======

>>>>>>> 230c220864a825afec575f0000ab00412668c75f
        [HttpPost("add")]
        public async Task<IActionResult> AddReview([FromBody] AddReview dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "data not access",
                    Errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)
                });
            }

            var patientId = await GetCurrentPatientIdAsync();
            if (patientId == null) return Unauthorized();

<<<<<<< HEAD
            
=======

>>>>>>> 230c220864a825afec575f0000ab00412668c75f
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
                    Message = "book first"
<<<<<<< HEAD
                } );
            }

            
=======
                });
            }


>>>>>>> 230c220864a825afec575f0000ab00412668c75f
            var existingReview = await _reviewRepo.GetOneAsynch(r => r.AppointmentId == dto.AppointmentId);
            if (existingReview != null)
            {
                return BadRequest(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "you aready reviw"
                });
            }

<<<<<<< HEAD
            
=======

>>>>>>> 230c220864a825afec575f0000ab00412668c75f
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

<<<<<<< HEAD
=======
            // Recalculate doctor's average rating after new review.
            // completedAppointment.DoctorId is already in scope — no extra query needed.
            await _doctorService.UpdateDoctorAverageRatingAsync(completedAppointment.DoctorId);

>>>>>>> 230c220864a825afec575f0000ab00412668c75f
            return Ok(new ApiResponse<object>
            {
                IsSuccess = true,
                Message = "your reviw success"
            });
        }

<<<<<<< HEAD
        
=======

>>>>>>> 230c220864a825afec575f0000ab00412668c75f
        [HttpGet("myreviews")]
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
<<<<<<< HEAD
                    r => r.Appointment.Doctor.User
                }
            );

            return Ok(new ApiResponse<IEnumerable<Review>>
            {
                IsSuccess = true,
                Message = "your reviw",
                Data = reviews
            });
        }

        
=======
                    r => r.Appointment.Doctor.User,
                    r => r.Patient,
                    r => r.Patient.User
                }
            );

            var response = reviews.Select(r => new
            {
                ReviewId = r.Id,
                AppointmentId = r.AppointmentId,
                PatientName = (r.Patient?.User != null) ? $"{r.Patient.User.FirstName} {r.Patient.User.LastName}" : "Unknown",
                DoctorName = (r.Appointment?.Doctor?.User != null) ? $"{r.Appointment.Doctor.User.FirstName} {r.Appointment.Doctor.User.LastName}" : "Unknown",
                Rating = r.Rating,
                Comment = r.Comment,
                CreatedAt = r.CreatedAt
            }).ToList();

            return Ok(new ApiResponse<object>
            {
                IsSuccess = true,
                Message = "your reviw",
                Data = response
            });
        }


>>>>>>> 230c220864a825afec575f0000ab00412668c75f
        [HttpPut("update/{reviewId}")]
        public async Task<IActionResult> UpdateReview(Guid reviewId, [FromBody] UpdateReviewDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "data not access",
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
                    Message = "not found"
                });
            }

            review.Rating = dto.Rating;
            review.Comment = dto.Comment;

            _reviewRepo.Update(review);
            await _reviewRepo.CommitChangesAsync();

<<<<<<< HEAD
=======
            // Fetch appointment in a separate no-tracking query to get DoctorId.
            // Avoids loading Appointment as a navigation property on the Review entity,
            // which would cause EF to emit an unintended UPDATE on the Appointments table
            // when _reviewRepo.Update(review) marks all tracked entities as Modified.
            var updatedAppointment = await _appointmentRepo.GetOneAsynch(a => a.Id == review.AppointmentId);
            if (updatedAppointment != null)
                await _doctorService.UpdateDoctorAverageRatingAsync(updatedAppointment.DoctorId);

>>>>>>> 230c220864a825afec575f0000ab00412668c75f
            return Ok(new ApiResponse<object>
            {
                IsSuccess = true,
                Message = "update success"
            });
        }

<<<<<<< HEAD
        
=======

>>>>>>> 230c220864a825afec575f0000ab00412668c75f
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
                    Message = "not fond"
                });
            }

<<<<<<< HEAD
            _reviewRepo.Delete(review);
            await _reviewRepo.CommitChangesAsync();

=======
            // Capture AppointmentId before the entity is deleted from the change tracker.
            var appointmentId = review.AppointmentId;

            _reviewRepo.Delete(review);
            await _reviewRepo.CommitChangesAsync();

            // Separate no-tracking query — same safe pattern as UpdateReview.
            var deletedAppointment = await _appointmentRepo.GetOneAsynch(a => a.Id == appointmentId);
            if (deletedAppointment != null)
                await _doctorService.UpdateDoctorAverageRatingAsync(deletedAppointment.DoctorId);

>>>>>>> 230c220864a825afec575f0000ab00412668c75f
            return Ok(new ApiResponse<object>
            {
                IsSuccess = true,
                Message = "delete success"
            });
        }

<<<<<<< HEAD
        
=======

>>>>>>> 230c220864a825afec575f0000ab00412668c75f
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
<<<<<<< HEAD
                    r => r.Appointment
                }
            );

            return Ok(new ApiResponse<IEnumerable<Review>>
            {
                IsSuccess = true,
                Message = "review fot adoctor",
                Data = reviews
=======
                    r => r.Appointment,
                    r => r.Appointment.Doctor,
                    r => r.Appointment.Doctor.User
                }
            );

            var response = reviews.Select(r => new
            {
                ReviewId = r.Id,
                AppointmentId = r.AppointmentId,
                PatientName = (r.Patient?.User != null) ? $"{r.Patient.User.FirstName} {r.Patient.User.LastName}" : "Unknown",
                DoctorName = (r.Appointment?.Doctor?.User != null) ? $"{r.Appointment.Doctor.User.FirstName} {r.Appointment.Doctor.User.LastName}" : "Unknown",
                Rating = r.Rating,
                Comment = r.Comment,
                CreatedAt = r.CreatedAt
            }).ToList();

            return Ok(new ApiResponse<object>
            {
                IsSuccess = true,
                Message = "review fot adoctor",
                Data = response
>>>>>>> 230c220864a825afec575f0000ab00412668c75f
            });
        }
    }

<<<<<<< HEAD
    
=======

>>>>>>> 230c220864a825afec575f0000ab00412668c75f
    public class UpdateReviewDto
    {
        [System.ComponentModel.DataAnnotations.Required]
        [System.ComponentModel.DataAnnotations.Range(1, 5, ErrorMessage = "Rate from 1 to 5")]
        public int Rating { get; set; }
        public string Comment { get; set; } = string.Empty;

    }
<<<<<<< HEAD
}
=======
}
>>>>>>> 230c220864a825afec575f0000ab00412668c75f
