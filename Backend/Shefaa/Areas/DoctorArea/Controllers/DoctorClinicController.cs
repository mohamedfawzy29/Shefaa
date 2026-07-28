using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Shefaa.Data;
using Shefaa.DTOs.Request;
using Shefaa.DTOs.Response;
using Shefaa.Models;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Mapster;

namespace Shefaa.Areas.DoctorArea.Controllers
{
    [Area(CD.DOCTOR_AREA)]
    [Route("api/[area]/[controller]")]
    [ApiController]
    [Authorize(Roles = CD.DOCTOR_ROLE)]
    public class DoctorClinicController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DoctorClinicController(ApplicationDbContext context)
        {
            _context = context;
        }

        
        private async Task<Guid?> GetCurrentDoctorIdAsync()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim)) return null;

            var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.UserId == Guid.Parse(userIdClaim));
            return doctor?.DoctorId;
        }


        [HttpPost("JoinBranch")]
        public async Task<IActionResult> JoinBranch([FromBody] AddDoctorBranchRequest request)
        {
            var doctorId = await GetCurrentDoctorIdAsync();
            if (doctorId == null)
            {
                return Unauthorized(new ApiResponse<object> { IsSuccess = false, Message = "Sorry, your account is not registered as a doctor in the system." });
            }

            
            var branchExists = await _context.Branches.AnyAsync(b => b.Id == request.BranchId);
            if (!branchExists)
            {
                return NotFound(new ApiResponse<object> { IsSuccess = false, Message = "The specified branch does not exist." });
            }

            
            var alreadyJoined = await _context.DoctorBranches
                .AnyAsync(db => db.DoctorId == doctorId && db.BranchId == request.BranchId);

            if (alreadyJoined)
            {
                return BadRequest(new ApiResponse<object> { IsSuccess = false, Message = "You are already registered in this branch." });
            }

            
            if (request.IsPrimary)
            {
                var primaryBranches = await _context.DoctorBranches
                    .Where(db => db.DoctorId == doctorId && db.IsPrimary)
                    .ToListAsync();

                foreach (var b in primaryBranches)
                {
                    b.IsPrimary = false;
                }
            }

            var doctorBranch = new DoctorBranch
            {
                DoctorId = doctorId.Value,
                BranchId = request.BranchId,
                ConsultionFee = request.ConsultionFee,
                IsPrimary = request.IsPrimary
            };

            _context.DoctorBranches.Add(doctorBranch);
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object> { IsSuccess = true, Message = "The branch has been successfully subscribed and the disclosure value has been determined." });
        }

        [HttpGet("MyBranches")]
        public async Task<IActionResult> GetMyBranches()
        {
            var doctorId = await GetCurrentDoctorIdAsync();
            if (doctorId == null) return Unauthorized(new ApiResponse<object> { IsSuccess = false, Message = "Unauthorized." });

            var branches = await _context.DoctorBranches
                .Where(db => db.DoctorId == doctorId)
                .Select(db => new
                {
                    db.BranchId,
                    db.ConsultionFee,
                    db.IsPrimary
                }).ToListAsync();

            return Ok(new ApiResponse<object> { IsSuccess = true, Message = "Your branches have been brought in.", Data = branches });
        }

        [HttpGet("MySchedules")]
        public async Task<IActionResult> GetMySchedules()
        {
            var doctorId = await GetCurrentDoctorIdAsync();
            if (doctorId == null) return Unauthorized(new ApiResponse<object> { IsSuccess = false, Message = "Unauthorized." });

            var schedules = await _context.DoctorSchedules
                .Where(ds => ds.DoctorId == doctorId)
                .Select(ds => new
                {
                    ds.Id,
                    ds.BranchId,
                    ds.DayOfWeek,
                    ds.StartTime,
                    ds.EndTime,
                    ds.SlotDurationMinutes,
                    ds.MaxPatients,
                    ds.IsActive
                })
                .ToListAsync();

            return Ok(new ApiResponse<object>
            {
                IsSuccess = true,
                Message = "Your schedules have been retrieved.",
                Data = schedules
            });
        }


        [HttpPost("AddSchedule")]
        public async Task<IActionResult> AddSchedule([FromBody] AddDoctorScheduleRequest request)
        {
            var doctorId = await GetCurrentDoctorIdAsync();
            if (doctorId == null) return Unauthorized(new ApiResponse<object> { IsSuccess = false, Message = "Unauthorized." });

            
            var worksInBranch = await _context.DoctorBranches
                .AnyAsync(db => db.DoctorId == doctorId && db.BranchId == request.BranchId);

            if (!worksInBranch)
            {
                return BadRequest(new ApiResponse<object> { IsSuccess = false, Message = "You must subscribe to the branch first before adding a schedule to it." });
            }

             
            if (request.StartTime >= request.EndTime)
            {
                return BadRequest(new ApiResponse<object> { IsSuccess = false, Message = "The start time of work must be before the end time." });
            }

             
            var schedule = new DoctorSchedule
            {
                Id = Guid.NewGuid(),
                DoctorId = doctorId.Value,
                BranchId = request.BranchId,
                DayOfWeek = request.DayOfWeek,
                StartTime = request.StartTime,
                EndTime = request.EndTime,
                SlotDurationMinutes = request.SlotDurationMinutes,
                MaxPatients = request.MaxPatients,
                IsActive = true
            };

            _context.DoctorSchedules.Add(schedule);
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object> { IsSuccess = true, Message = "Branch working hours have been added successfully." });
        }


        [HttpGet("TodayAppointments")]
        public async Task<IActionResult> GetTodayAppointments()
        {
            var doctorId = await GetCurrentDoctorIdAsync();
            if (doctorId == null) return Unauthorized(new ApiResponse<object> { IsSuccess = false, Message = "Unauthorized." });

            var today = DateOnly.FromDateTime(DateTime.Today);

            var appointments = await _context.Appointments
                .Where(a => a.DoctorId == doctorId && a.AppointmentDate == today)
                .Include(a => a.Patient)
                    .ThenInclude(p => p.User)
                .Include(a => a.Branch) 
                .OrderBy(a => a.StartTime)
                .ProjectToType<DoctorAppointmentResponse>()
                .ToListAsync();

            return Ok(new ApiResponse<object>
            {
                IsSuccess = true,
                Message = "Today's appointments retrieved successfully.",
                Data = appointments
            });
        }

        [HttpDelete("LeaveBranch/{branchId}")]
        public async Task<IActionResult> LeaveBranch(Guid branchId)
        {
            var doctorId = await GetCurrentDoctorIdAsync();
            if (doctorId == null) return Unauthorized(new ApiResponse<object> { IsSuccess = false, Message = "Unauthorized." });

            var doctorBranch = await _context.DoctorBranches.FirstOrDefaultAsync(db => db.DoctorId == doctorId && db.BranchId == branchId);
            if (doctorBranch == null)
            {
                return NotFound(new ApiResponse<object> { IsSuccess = false, Message = "You are not registered in this branch." });
            }

            var hasUpcomingAppointments = await _context.Appointments
                .AnyAsync(a => a.DoctorId == doctorId && a.BranchId == branchId && (a.Status == AppointmentStatus.Scheduled || a.Status == AppointmentStatus.CheckedIn));

            if (hasUpcomingAppointments)
            {
                return BadRequest(new ApiResponse<object> { IsSuccess = false, Message = "You cannot leave this branch because you have upcoming appointments." });
            }

            _context.DoctorBranches.Remove(doctorBranch);

            var schedules = await _context.DoctorSchedules.Where(ds => ds.DoctorId == doctorId && ds.BranchId == branchId).ToListAsync();
            if (schedules.Any())
            {
                _context.DoctorSchedules.RemoveRange(schedules);
            }

            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object> { IsSuccess = true, Message = "You have successfully left the branch." });
        }

    }
}