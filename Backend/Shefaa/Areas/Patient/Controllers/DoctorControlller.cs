<<<<<<< HEAD
﻿using Shefaa.DTOs.filter;
namespace Shefaa.Areas.Patient.Controllers
{
    [Area(CD.PATIENT_AREA)]
    [Route("api/Patient/[controller]")]
=======
using Shefaa.DTOs.filter;

namespace Shefaa.Areas.Patient.Controllers
{
    [Area(CD.PATIENT_AREA)]
    [Route("api/[area]/[controller]")]
>>>>>>> 230c220864a825afec575f0000ab00412668c75f
    [Authorize(Roles = CD.PATIENT_ROLE)]
    [ApiController]
    public class DoctorController : ControllerBase
    {
        private readonly IRepository<Doctor> _doctorRepo;

<<<<<<< HEAD
        
=======
>>>>>>> 230c220864a825afec575f0000ab00412668c75f
        public DoctorController(IRepository<Doctor> doctorRepo)
        {
            _doctorRepo = doctorRepo;
        }

<<<<<<< HEAD
        
        [HttpGet]
        public async Task<IActionResult> GetDoctors([FromQuery] DoctorFilter filter)
        {
            
            var doctors = await _doctorRepo.GetAsync(
                filter: d =>
                    (string.IsNullOrEmpty(filter.SearchQuery) || d.User.FirstName.Contains(filter.SearchQuery)) &&
                    (!filter.SpecializationId.HasValue || d.SpecializationId == filter.SpecializationId.Value),

=======
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetDoctors([FromQuery] DoctorFilter filter)
        {
            var doctors = await _doctorRepo.GetAsync(
                filter: d =>
                    d.Status == DoctorStatus.Approved &&
                    (string.IsNullOrEmpty(filter.SearchQuery) || d.User.FirstName.Contains(filter.SearchQuery)) &&
                    (!filter.SpecializationId.HasValue || d.SpecializationId == filter.SpecializationId.Value),
>>>>>>> 230c220864a825afec575f0000ab00412668c75f
                includes: new System.Linq.Expressions.Expression<Func<Doctor, object>>[]
                {
                    d => d.User,
                    d => d.Specialization
<<<<<<< HEAD
                    }
            );

            
            if (!string.IsNullOrEmpty(filter.OrderBy) && filter.OrderBy.ToLower() == "rating")
            {
                doctors = doctors.OrderByDescending(d => d.AverageRating);
            }

            return Ok(doctors);
        }

        
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDoctorDetails(Guid id)
        {
            
=======
                }
            );

            if (!string.IsNullOrEmpty(filter.OrderBy) && filter.OrderBy.ToLower() == "rating")
                doctors = doctors.OrderByDescending(d => d.AverageRating);

            var response = doctors.Select(d => new PublicDoctorResponse
            {
                DoctorId          = d.DoctorId,
                FirstName         = d.User.FirstName,
                LastName          = d.User.LastName,
                ProfileImageUrl   = $"{Request.Scheme}://{Request.Host}/images/profiles/{d.User.ProfileImg}",
                Specialization    = d.Specialization.Name,
                Bio               = d.Bio,
                YearsOfExperience = d.YearsOfExperience,
                AverageRating     = d.AverageRating,
                Status            = d.Status
            });

            return Ok(new ApiResponse<IEnumerable<PublicDoctorResponse>>
            {
                IsSuccess = true,
                Message   = "Doctors retrieved successfully.",
                Data      = response
            });
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDoctorDetails(Guid id)
        {
>>>>>>> 230c220864a825afec575f0000ab00412668c75f
            var doctor = await _doctorRepo.GetOneAsynch(
                filter: d => d.DoctorId == id,
                includes: new System.Linq.Expressions.Expression<Func<Doctor, object>>[]
                {
                    d => d.User,
                    d => d.Specialization,
<<<<<<< HEAD
                    d => d.DoctorSchedules, 
                           
                }
            );

           if (doctor == null)
            {
                return NotFound(new { Message ="Sorry doctor not found" });
           }

            return Ok(doctor);
=======
                    d => d.DoctorSchedules,
                    d => d.Appointments
                }
            );

            if (doctor == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message   = "Doctor not found."
                });
            }

            var today = DateOnly.FromDateTime(DateTime.UtcNow);
            
            var response = new PublicDoctorResponse
            {
                DoctorId          = doctor.DoctorId,
                FirstName         = doctor.User.FirstName,
                LastName          = doctor.User.LastName,
                ProfileImageUrl   = $"{Request.Scheme}://{Request.Host}/images/profiles/{doctor.User.ProfileImg}",
                Specialization    = doctor.Specialization.Name,
                Bio               = doctor.Bio,
                YearsOfExperience = doctor.YearsOfExperience,
                AverageRating     = doctor.AverageRating,
                Status            = doctor.Status,
                DoctorSchedules   = doctor.DoctorSchedules.Select(s => new PublicScheduleResponse
                {
                    Id                  = s.Id,
                    BranchId            = s.BranchId,
                    DayOfWeek           = s.DayOfWeek,
                    StartTime           = s.StartTime,
                    EndTime             = s.EndTime,
                    SlotDurationMinutes = s.SlotDurationMinutes,
                    MaxPatients         = s.MaxPatients,
                    IsActive            = s.IsActive
                }),
                BookedSlots = doctor.Appointments
                    .Where(a => a.AppointmentDate >= today && a.Status == AppointmentStatus.Scheduled)
                    .Select(a => new PublicBookedSlotResponse
                    {
                        Date = a.AppointmentDate,
                        StartTime = a.StartTime
                    })
            };

            return Ok(new ApiResponse<PublicDoctorResponse>
            {
                IsSuccess = true,
                Message   = "Doctor retrieved successfully.",
                Data      = response
            });
>>>>>>> 230c220864a825afec575f0000ab00412668c75f
        }
    }
}
