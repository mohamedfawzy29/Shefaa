using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Shefaa.DTOs.dashboard;
using Shefaa.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;



namespace Shefaa.Areas.Admin.Controllers
{
    [Area(CD.ADMIN_AREA)]
    [Route("api/ [Area]/[controller]")]
    [Authorize(Roles = CD.ADMIN_ROLE)]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public DashboardController(UserManager<ApplicationUser> userManager, ApplicationDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        
        [HttpGet("counters")]
        public async Task<IActionResult> GetCounters()
        {
            var counters = new DBcounter
            {
                TotalUsers = await _userManager.Users.CountAsync(),
                TotalDoctors = await _context.Doctors.CountAsync(),
                TotalAppointments = await _context.Appointments.CountAsync(),
                TotalOrganizations = await _context.Organizations.CountAsync(),
            };

            return Ok(new ApiResponse<DBcounter>
            {
                IsSuccess = true,
                Message = "تم جلب العدادات بنجاح",
                Data = counters
            });
        }

        
        [HttpGet("appointment-chart")]
        public async Task<IActionResult> GetAppointmentStatusChart()
        {
            var chartData = await _context.Appointments
                .GroupBy(a => a.Status)
                .Select(g => new
                {
                    Label = g.Key.ToString(),
                    Value = g.Count()
                })
                .ToListAsync();

            return Ok(new ApiResponse<object>
            {
                IsSuccess = true,
                Message = "تم جلب مخطط حالات الحجوزات بنجاح",
                Data = chartData
            });
        }

        
        [HttpGet("top-specializations-chart")]
        public async Task<IActionResult> GetTopSpecializationsChart()
        {
            var chartData = await _context.Appointments
                .GroupBy(a => a.Doctor.Specialization.Name)
                .Select(g => new
                {
                    Label = g.Key,
                    Value = g.Count()
                })
                .OrderByDescending(x => x.Value)
                .Take(5)
                .ToListAsync();

            return Ok(new ApiResponse<object>
            {
                IsSuccess = true,
                Message = "top specialization",
                Data = chartData
            });
        }

        
        [HttpGet("pending-doctors")]
        public async Task<IActionResult> GetPendingDoctors()
        {
            var pendingDoctors = await _context.Doctors
                .Include(d => d.User)
                .Include(d => d.Specialization)
                .Select(d => new
                {
                    DoctorId = d.Id,
                    FullName = d.User.FirstName + " " + d.User.LastName,
                    Email = d.User.Email,
                    Specialization = d.Specialization.Name,
                    Gender = d.User.Gender,
                    Phone = d.User.PhoneNumber
                })
                .ToListAsync();

            return Ok(new ApiResponse<object>
            {
                IsSuccess = true,
                Message = "doctors pending ",
                Data = pendingDoctors
            });
        }

        [HttpPut("review-doctor/{doctorId}")]
        public async Task<IActionResult> ReviewDoctor(Guid doctorId, [FromBody] ReviewStatusDto dto)
        {
            var doctor = await _context.Doctors.Include(d => d.User).FirstOrDefaultAsync(d => d.Id == doctorId);
            if (doctor == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "doctor determind not found"
                });
            }

            if (dto.Approve)
            {
                
                await _context.SaveChangesAsync();
                return Ok(new ApiResponse<object> { IsSuccess = true, Message = " doctor accept" });
            }
            else
            {
                _context.Doctors.Remove(doctor);
                await _context.SaveChangesAsync();
                return Ok(new ApiResponse<object> { IsSuccess = true, Message = "doctor not accept" });
            }
        }

        
        [HttpGet("recent-activities")]
        public async Task<IActionResult> GetRecentActivities()
        {
            var recentAppointments = await _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Patient.User)
                .Include(a => a.Doctor)
                .Include(a => a.Doctor.User)
                .OrderByDescending(a => a.AppointmentDate)
                .Take(5)
                .Select(a => new
                {
                    AppointmentId = a.Id,
                    PatientName = a.Patient.User.FirstName + " " + a.Patient.User.LastName,
                    DoctorName = a.Doctor.User.FirstName + " " + a.Doctor.User.LastName,
                    Date = a.AppointmentDate.ToString("yyyy-MM-dd"),
                    Time = a.StartTime.ToString(@"hh\:mm"),
                    Status = a.Status.ToString()
                })
                .ToListAsync();

            return Ok(new ApiResponse<object>
            {
                IsSuccess = true,
                Message = "recent activities fetched successfully",
                Data = recentAppointments
            });
        }
    }

    
    public class ReviewStatusDto
    {
        public bool Approve { get; set; }



    }
}
