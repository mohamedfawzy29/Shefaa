using Shefaa.DTOs.filter;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Shefaa.DTOs.Response;

namespace Shefaa.Areas.Patient.Controllers
{
    [Area(CD.PATIENT_AREA)]
    [Route("api/[area]/[controller]")]
    [Authorize(Roles = CD.PATIENT_ROLE)]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        IRepository<Appointment> _appointment;
        IRepository<Models.Patient> _patient;

        public AppointmentController(
            IRepository<Appointment> appointmentRepo,
            IRepository<Models.Patient> patientRepo)
        {
            _appointment = appointmentRepo;
            _patient = patientRepo;
        }


        [HttpPost("book")]
        public async Task<IActionResult> BookAppointment([FromBody] BookAppiontment dto)
        {

            var patientId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(patientId))
                return Unauthorized(new { Message = " Login required" });

            Guid patientGuid = Guid.Parse(patientId);
            var patient = await _patient.GetOneAsynch(filter: p => p.UserId == patientGuid);
            if (patient == null) return Unauthorized(new { Message = "Patient profile not found" });

            var appointment = new Appointment
            {
                Id = Guid.NewGuid(),
                DoctorId = dto.DoctorId,
                BranchId = dto.BranchId,
                PatientId = patient.PatientId,
                AppointmentDate = dto.AppointmentDate,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime,
                VisitReason = dto.VisitReason,
                Status = AppointmentStatus.Scheduled,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _appointment.AddAsync(appointment);
            await _appointment.CommitChangesAsync();

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
            var patient = await _patient.GetOneAsynch(filter: p => p.UserId == patientGuid);
            if (patient == null) return Unauthorized();


            var appointments = await _appointment.GetAsync(
                filter: a => a.PatientId == patient.PatientId &&
                            (!status.HasValue || a.Status == status.Value),
                includes: new System.Linq.Expressions.Expression<Func<Appointment, object>>[]
                {
                    a => a.Doctor,
                    a => a.Doctor.User,
                    a => a.Doctor.Specialization,
                    a => a.Patient,
                    a => a.Patient.User,
                    a => a.Branch
                }
            );


            var orderedAppointments = appointments
                .OrderByDescending(a => a.AppointmentDate)
                .ThenByDescending(a => a.StartTime);

            var response = orderedAppointments.Select(a => new
            {
                Id = a.Id,
                AppointmentDate = a.AppointmentDate,
                StartTime = a.StartTime,
                EndTime = a.EndTime,
                VisitReason = a.VisitReason,
                Status = a.Status,
                Notes = a.Notes,
                Doctor = a.Doctor == null ? null : new
                {
                    DoctorId = a.Doctor.DoctorId,
                    User = a.Doctor.User == null ? null : new
                    {
                        FirstName = a.Doctor.User.FirstName,
                        LastName = a.Doctor.User.LastName,
                        ProfileImg = a.Doctor.User.ProfileImg
                    },
                    Specialization = a.Doctor.Specialization == null ? null : new
                    {
                        Name = a.Doctor.Specialization.Name
                    }
                },
                Branch = a.Branch == null ? null : new
                {
                    Id = a.Branch.Id,
                    BranchName = a.Branch.BranchName,
                    Address = a.Branch.Address
                }
            }).ToList();

            return Ok(response);
        }


        [HttpPut("cancel/{id}")]
        public async Task<IActionResult> CancelAppointment(Guid id)
        {
            var patientId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(patientId)) return Unauthorized();

            Guid patientGuid = Guid.Parse(patientId);
            var patient = await _patient.GetOneAsynch(filter: p => p.UserId == patientGuid);
            if (patient == null) return Unauthorized();


            var appointment = await _appointment.GetOneAsynch(
                filter: a => a.Id == id && a.PatientId == patient.PatientId
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

            _appointment.Update(appointment);
            await _appointment.CommitChangesAsync();

            return Ok(new ApiResponse<MedicalRecord>
            {
                IsSuccess = true,
                Message = "cancel successfully",

            });
        }

        [HttpPut("reschedule/{id}")]
        public async Task<IActionResult> RescheduleAppointment(Guid id, ReschduleAppointment dto)
        {

            var patientId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(patientId)) return Unauthorized();

            Guid patientGuid = Guid.Parse(patientId);
            var patient = await _patient.GetOneAsynch(filter: p => p.UserId == patientGuid);
            if (patient == null) return Unauthorized();


            var appointment = await _appointment.GetOneAsynch(
                filter: a => a.Id == id && a.PatientId == patient.PatientId
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


            appointment.AppointmentDate = DateOnly.FromDateTime(dto.NewAppointmentDate);
            appointment.StartTime = TimeOnly.FromTimeSpan(dto.NewStartTime);
            appointment.EndTime = TimeOnly.FromTimeSpan(dto.NewEndTime);
            appointment.UpdatedAt = DateTime.UtcNow;


            appointment.Status = AppointmentStatus.Scheduled;


            _appointment.Update(appointment);
            await _appointment.CommitChangesAsync();

            return Ok(new ApiResponse<MedicalRecord>
            {
                IsSuccess = true,
                Message = "Reschedule successfully",

            });
        }
    }
}