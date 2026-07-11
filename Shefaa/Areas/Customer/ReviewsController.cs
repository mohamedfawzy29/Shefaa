using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Shefaa.Repositories;
using System.Security.Claims;
using Shefaa.DTOs.filter;
namespace Shefaa.Areas.Customer
{
    [Route("api/Customer/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly IRepository<Review> _reviewRepo;

        public ReviewsController(IRepository<Review> reviewRepo)
        {
            _reviewRepo = reviewRepo;
        }

        
        //[HttpPost("add")]
        //public async Task<IActionResult> AddReview([FromBody] AddReview dto)
        //{
        //    var patientId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        //    if (string.IsNullOrEmpty(patientId))
        //        return Unauthorized(new { Message = "Login required" });

        //    var review = new Review
        //    {
        //        Id = Guid.NewGuid(),
        //        DoctorId = dto.DoctorId,
        //        AppointmentId = dto.AppointmentId, 
        //        PatientId = Guid.Parse(patientId),
        //        Rating = dto.Rating, 
        //        Comment = dto.Comment,
        //        CreatedAt = DateTime.UtcNow
        //    };

        //    await _reviewRepo.AddAsync(review);
        //    await _reviewRepo.CommitChangesAsync();

        //    return Ok(new { Message = "Review complete success" });
        //}

        
        //[AllowAnonymous] 
        //[HttpGet("doctor/{doctorId}")]
        //public async Task<IActionResult> GetDoctorReviews(Guid doctorId)
        //{
            
        //    var reviews = await _reviewRepo.GetAsync(
        //        filter: r => r.DoctorId == doctorId,
        //        includes: new System.Linq.Expressions.Expression<Func<Review, object>>[]
        //        {
        //            r => r.Patient,
        //            r => r.Patient.User 
        //        }
        //    );

        //    var orderedReviews = reviews.OrderByDescending(r => r.CreatedAt);

        //    return Ok(orderedReviews);
        //}
    }
}
