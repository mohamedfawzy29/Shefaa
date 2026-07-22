using Shefaa.DTOs.filter;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Shefaa.DTOs.Response;
{
    
}

namespace Shefaa.Areas.Patient.Controllers
{
    [Area(CD.PATIENT_AREA)]
    [Route("api/Patient/[controller]")]
    [Authorize(Roles = CD.PATIENT_ROLE)]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        IRepository<Appointment> _appointmentRepo;

        public AppointmentController(IRepository<Appointment> appointmentRepo)
        {
            _appointmentRepo = appointmentRepo;
        }

        
        [HttpPost("book")]
        public async Task<IActionResult> BookAppointment([FromBody] BookAppiontment dto)
        {
            
            var patientId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(patientId))
                return Unauthorized(new { Message = " Login required" });

            var appointment = new Appointment
            {
                Id = Guid.NewGuid(),
                DoctorId = dto.DoctorId,
                BranchId = dto.BranchId,
                PatientId = Guid.Parse(patientId), 
                AppointmentDate = dto.AppointmentDate,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime,
                VisitReason = dto.VisitReason,
                Status = AppointmentStatus.Scheduled, 
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _appointmentRepo.AddAsync(appointment);
            await _appointmentRepo.CommitChangesAsync();

            return Ok(new ApiResponse<IEnumerable<MedicalRecord>>
            {
                IsSuccess = true,
                Message = "book success ",
               
            });
        }

        
        [HttpGet("my-appointments")]
        public async Task<IActionResult> GetMyAppointments([FromQuery] AppointmentStatus? status)
        {
            var patientId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(patientId)) return Unauthorized();

            Guid patientGuid = Guid.Parse(patientId);

            
            var appointments = await _appointmentRepo.GetAsync(
                filter: a => a.PatientId == patientGuid &&
                            (!status.HasValue || a.Status == status.Value),
                includes: new System.Linq.Expressions.Expression<Func<Appointment, object>>[]
                {
                    a => a.Doctor,
                    a => a.Doctor.User,
                    a => a.Branch
                }
            );

            
            var orderedAppointments = appointments
                .OrderByDescending(a => a.AppointmentDate)
                .ThenByDescending(a => a.StartTime);

            return Ok(orderedAppointments);
        }

        
        [HttpPut("cancel/{id}")]
        public async Task<IActionResult> CancelAppointment(Guid id)
        {
            var patientId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(patientId)) return Unauthorized();

            Guid patientGuid = Guid.Parse(patientId);

            
            var appointment = await _appointmentRepo.GetOneAsynch(
                filter: a => a.Id == id && a.PatientId == patientGuid
            );

            if (appointment == null)
            {
                return NotFound(new { Message = "book not found" });
            }

            if (appointment.Status == AppointmentStatus.Cancelled)
            {
                return NotFound(new ApiResponse<MedicalRecord>
                {
                    IsSuccess = false,
                    Message = "cancelled",
                    
                });
            }

            
            appointment.Status = AppointmentStatus.Cancelled;
            appointment.CancelledAt = DateTime.UtcNow;
            appointment.UpdatedAt = DateTime.UtcNow;

            _appointmentRepo.Update(appointment);
            await _appointmentRepo.CommitChangesAsync();

            return Ok(new ApiResponse<MedicalRecord>
            {
                IsSuccess = true,
                Message = "cancel successfully",
               
            });
        }

        [HttpPut("reschedule/{id}")]
        public async Task<IActionResult> RescheduleAppointment(Guid id,  ReschduleAppointment dto)
        {
            
            var patientId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(patientId)) return Unauthorized();

            Guid patientGuid = Guid.Parse(patientId);

            
            var appointment = await _appointmentRepo.GetOneAsynch(
                filter: a => a.Id == id && a.PatientId == patientGuid
            );

            if (appointment == null)
            {
                return NotFound(new ApiResponse<MedicalRecord>
                {
                    IsSuccess = false,
                    Message = "Appoint not found",

                });
            }

            
            if (appointment.Status == AppointmentStatus.Cancelled || appointment.Status == AppointmentStatus.Completed)
            {
                return BadRequest(new { Message = "Cannot reschedule an appointment with this status" });
            }

            
            appointment.AppointmentDate =DateOnly.FromDateTime( dto.NewAppointmentDate);
            appointment.StartTime =  TimeOnly.FromTimeSpan(dto.NewStartTime);
            appointment.EndTime = TimeOnly.FromTimeSpan(dto.NewEndTime);
            appointment.UpdatedAt = DateTime.UtcNow;

            
            appointment.Status = AppointmentStatus.Scheduled;

            
            _appointmentRepo.Update(appointment);
            await _appointmentRepo.CommitChangesAsync();

             return Ok(new ApiResponse<MedicalRecord>
            {
                IsSuccess = true,
                Message = "Resch successfully",
               
            });
        }
    }
}
