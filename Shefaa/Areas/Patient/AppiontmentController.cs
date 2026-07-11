using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Shefaa.DTOs.filter;
using Shefaa.Repositories;
using System.Security.Claims;

namespace Shefaa.Areas.Customer
{
    [Route("api/Customer/[controller]")]
    [ApiController]
    public class AppiontmentController : ControllerBase
    {
        private readonly IRepository<Appointment> _appointmentRepo;

        public AppiontmentController(IRepository<Appointment> appointmentRepo)
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

            return Ok(new { Message = "BOOK Success" });
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
                return BadRequest(new { Message = "Cancelled" });
            }

            
            appointment.Status = AppointmentStatus.Cancelled;
            appointment.CancelledAt = DateTime.UtcNow;
            appointment.UpdatedAt = DateTime.UtcNow;

            _appointmentRepo.Update(appointment);
            await _appointmentRepo.CommitChangesAsync();

            return Ok(new { Message = "cancelled done" });
        }

        // انشاء واجهة برمجة تطبيقات لإعادة جدولة المواعيد
    }
}
