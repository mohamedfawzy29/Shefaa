using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Shefaa.Data;
using Shefaa.DTOs.Response;
using Shefaa.Models;
using System.Linq.Expressions;

namespace Shefaa.Areas.ReceptionistArea.Controllers
{
    [Area("Receptionist")]
    [Route("api/[area]/[controller]")]
    [ApiController]
    [Authorize(Roles = CD.RECEPTIONIST_ROLE)]
    public class AppointmentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IRepository<Receptionist> _receptionistRepository;
        private readonly IRepository<Appointment> _appointmentRepository;
        private readonly UserManager<ApplicationUser> _userManager;

        public AppointmentController(
            ApplicationDbContext context,
            IRepository<Appointment> appointmentRepository,
            IRepository<Receptionist> receptionistRepository,
            UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _appointmentRepository = appointmentRepository;
            _receptionistRepository = receptionistRepository;
            _userManager = userManager;
        }

        [HttpGet("Today")]
        public async Task<IActionResult> GetTodayAppointments()
        {
            var receptionist = await GetCurrentReceptionistAsync();

            if (receptionist == null)
            {
                return Unauthorized(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Receptionist not found."
                });
            }



            var appointments = await _context.Appointments
           .Include(a => a.Patient)
               .ThenInclude(p => p.User)
           .Include(a => a.Doctor)
               .ThenInclude(d => d.User)
           .Include(a => a.Branch)
           .Where(a => a.BranchId == receptionist.BranchId &&
                       a.AppointmentDate == DateOnly.FromDateTime(DateTime.Today))
           .ToListAsync();


            var response = appointments.Select(a => new AppointmentResponse
            {
                AppointmentId = a.Id,

                PatientName = $"{a.Patient.User.FirstName} {a.Patient.User.LastName}",

                DoctorName = $"{a.Doctor.User.FirstName} {a.Doctor.User.LastName}",

                BranchName = a.Branch.BranchName,

                AppointmentDate = a.AppointmentDate,

                StartTime = a.StartTime,

                EndTime = a.EndTime,

                VisitReason = a.VisitReason,

                Notes = a.Notes,

                Status = a.Status,

                CreatedAt = a.CreatedAt,

                UpdatedAt = a.UpdatedAt,

                CancelledAt = a.CancelledAt
            }).ToList();
            return Ok(new ApiResponse<List<AppointmentResponse>>
            {
                IsSuccess = true,
                Message = "Today's appointments retrieved successfully.",
                Data = response
            });
        }

        private async Task<Receptionist?> GetCurrentReceptionistAsync()
        {
            var user = await _userManager.GetUserAsync(User);

            if (user == null)
                return null;

            return await _receptionistRepository.GetOneAsynch(
                r => r.UserId == user.Id
            );
        }



        [HttpPatch("{id:guid}/CheckIn")]
        public async Task<IActionResult> CheckInAppointment(Guid id)
        {
            // 1. Get Current Receptionist
            var receptionist = await GetCurrentReceptionistAsync();

            if (receptionist == null)
            {
                return Unauthorized(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Receptionist not found."
                });
            }

            // 2. Get Appointment
            var appointment = await _appointmentRepository.GetOneAsynch(
                a => a.Id == id,
                trackChanges: true);

            if (appointment == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Appointment not found."
                });
            }

            // 3. Branch Validation
            if (appointment.BranchId != receptionist.BranchId)
            {
                return BadRequest(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "You cannot modify appointments outside your branch."
                });
            }

            // 4. Status Validation
            if (appointment.Status != AppointmentStatus.Scheduled)
            {
                return BadRequest(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = $"Cannot check in appointment because its current status is {appointment.Status}."
                });
            }

            // 5. Update Appointment
            appointment.Status = AppointmentStatus.CheckedIn;
            appointment.UpdatedAt = DateTime.UtcNow;

            _appointmentRepository.Update(appointment);

            var result = await _appointmentRepository.CommitChangesAsync();

            if (result == 0)
            {
                return BadRequest(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Failed to update appointment."
                });
            }

            return Ok(new ApiResponse<object>
            {
                IsSuccess = true,
                Message = "Appointment checked in successfully."
            });
        }



        [HttpPatch("{id:guid}/NoShow")]
        public async Task<IActionResult> MarkAppointmentAsNoShow(Guid id)
        {
            // 1. Get Current Receptionist
            var receptionist = await GetCurrentReceptionistAsync();

            if (receptionist == null)
            {
                return Unauthorized(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Receptionist not found."
                });
            }

            // 2. Get Appointment
            var appointment = await _appointmentRepository.GetOneAsynch(
                a => a.Id == id,
                trackChanges: true);

            if (appointment == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Appointment not found."
                });
            }

            // 3. Branch Validation
            if (appointment.BranchId != receptionist.BranchId)
            {
                return BadRequest(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "You cannot modify appointments outside your branch."
                });
            }

            // 4. Status Validation
            if (appointment.Status != AppointmentStatus.Scheduled)
            {
                return BadRequest(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = $"Cannot mark appointment as No Show because its current status is {appointment.Status}."
                });
            }

            // 5. Update Appointment
            appointment.Status = AppointmentStatus.NoShow;
            appointment.UpdatedAt = DateTime.UtcNow;

            _appointmentRepository.Update(appointment);

            var result = await _appointmentRepository.CommitChangesAsync();

            if (result == 0)
            {
                return BadRequest(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Failed to update appointment."
                });
            }

            return Ok(new ApiResponse<object>
            {
                IsSuccess = true,
                Message = "Appointment marked as No Show successfully."
            });
        }


    }

}



