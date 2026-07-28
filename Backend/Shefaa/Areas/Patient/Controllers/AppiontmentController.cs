<<<<<<< HEAD
﻿using Shefaa.DTOs.filter;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Shefaa.DTOs.Response;
{
    
}
=======
using Shefaa.DTOs.filter;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Shefaa.DTOs.Response;
>>>>>>> 230c220864a825afec575f0000ab00412668c75f

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
    public class AppointmentController : ControllerBase
    {
<<<<<<< HEAD
        IRepository<Appointment> _appointmentRepo;

        public AppointmentController(IRepository<Appointment> appointmentRepo)
        {
            _appointmentRepo = appointmentRepo;
        }

        
        [HttpPost("book")]
        public async Task<IActionResult> BookAppointment([FromBody] BookAppiontment dto)
        {
            
=======
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

>>>>>>> 230c220864a825afec575f0000ab00412668c75f
            var patientId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(patientId))
                return Unauthorized(new { Message = " Login required" });

<<<<<<< HEAD
=======
            Guid patientGuid = Guid.Parse(patientId);
            var patient = await _patient.GetOneAsynch(filter: p => p.UserId == patientGuid);
            if (patient == null) return Unauthorized(new { Message = "Patient profile not found" });

            // Check if the slot is already booked
            var existingAppointment = await _appointment.GetOneAsynch(filter: a => 
                a.DoctorId == dto.DoctorId && 
                a.AppointmentDate == dto.AppointmentDate && 
                a.StartTime == dto.StartTime &&
                a.Status != AppointmentStatus.Cancelled);

            if (existingAppointment != null)
            {
                return BadRequest(new { Message = "This time slot is already booked." });
            }

>>>>>>> 230c220864a825afec575f0000ab00412668c75f
            var appointment = new Appointment
            {
                Id = Guid.NewGuid(),
                DoctorId = dto.DoctorId,
                BranchId = dto.BranchId,
<<<<<<< HEAD
                PatientId = Guid.Parse(patientId), 
=======
                PatientId = patient.PatientId,
>>>>>>> 230c220864a825afec575f0000ab00412668c75f
                AppointmentDate = dto.AppointmentDate,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime,
                VisitReason = dto.VisitReason,
<<<<<<< HEAD
                Status = AppointmentStatus.Scheduled, 
=======
                Status = AppointmentStatus.Scheduled,
>>>>>>> 230c220864a825afec575f0000ab00412668c75f
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

<<<<<<< HEAD
            await _appointmentRepo.AddAsync(appointment);
            await _appointmentRepo.CommitChangesAsync();
=======
            await _appointment.AddAsync(appointment);
            await _appointment.CommitChangesAsync();
>>>>>>> 230c220864a825afec575f0000ab00412668c75f

            return Ok(new ApiResponse<IEnumerable<MedicalRecord>>
            {
                IsSuccess = true,
                Message = "book success ",
<<<<<<< HEAD
               
            });
        }

        
=======

            });
        }


>>>>>>> 230c220864a825afec575f0000ab00412668c75f
        [HttpGet("my-appointments")]
        public async Task<IActionResult> GetMyAppointments([FromQuery] AppointmentStatus? status)
        {
            var patientId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(patientId)) return Unauthorized();

            Guid patientGuid = Guid.Parse(patientId);
<<<<<<< HEAD

            
            var appointments = await _appointmentRepo.GetAsync(
                filter: a => a.PatientId == patientGuid &&
=======
            var patient = await _patient.GetOneAsynch(filter: p => p.UserId == patientGuid);
            if (patient == null) return Unauthorized();


            var appointments = await _appointment.GetAsync(
                filter: a => a.PatientId == patient.PatientId &&
>>>>>>> 230c220864a825afec575f0000ab00412668c75f
                            (!status.HasValue || a.Status == status.Value),
                includes: new System.Linq.Expressions.Expression<Func<Appointment, object>>[]
                {
                    a => a.Doctor,
                    a => a.Doctor.User,
<<<<<<< HEAD
=======
                    a => a.Doctor.Specialization,
                    a => a.Patient,
                    a => a.Patient.User,
>>>>>>> 230c220864a825afec575f0000ab00412668c75f
                    a => a.Branch
                }
            );

<<<<<<< HEAD
            
=======

>>>>>>> 230c220864a825afec575f0000ab00412668c75f
            var orderedAppointments = appointments
                .OrderByDescending(a => a.AppointmentDate)
                .ThenByDescending(a => a.StartTime);

<<<<<<< HEAD
            return Ok(orderedAppointments);
        }

        
=======
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


>>>>>>> 230c220864a825afec575f0000ab00412668c75f
        [HttpPut("cancel/{id}")]
        public async Task<IActionResult> CancelAppointment(Guid id)
        {
            var patientId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(patientId)) return Unauthorized();

            Guid patientGuid = Guid.Parse(patientId);
<<<<<<< HEAD

            
            var appointment = await _appointmentRepo.GetOneAsynch(
                filter: a => a.Id == id && a.PatientId == patientGuid
=======
            var patient = await _patient.GetOneAsynch(filter: p => p.UserId == patientGuid);
            if (patient == null) return Unauthorized();


            var appointment = await _appointment.GetOneAsynch(
                filter: a => a.Id == id && a.PatientId == patient.PatientId
>>>>>>> 230c220864a825afec575f0000ab00412668c75f
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
<<<<<<< HEAD
                    
                });
            }

            
=======

                });
            }


>>>>>>> 230c220864a825afec575f0000ab00412668c75f
            appointment.Status = AppointmentStatus.Cancelled;
            appointment.CancelledAt = DateTime.UtcNow;
            appointment.UpdatedAt = DateTime.UtcNow;

<<<<<<< HEAD
            _appointmentRepo.Update(appointment);
            await _appointmentRepo.CommitChangesAsync();
=======
            _appointment.Update(appointment);
            await _appointment.CommitChangesAsync();
>>>>>>> 230c220864a825afec575f0000ab00412668c75f

            return Ok(new ApiResponse<MedicalRecord>
            {
                IsSuccess = true,
                Message = "cancel successfully",
<<<<<<< HEAD
               
=======

>>>>>>> 230c220864a825afec575f0000ab00412668c75f
            });
        }

        [HttpPut("reschedule/{id}")]
<<<<<<< HEAD
        public async Task<IActionResult> RescheduleAppointment(Guid id,  ReschduleAppointment dto)
        {
            
=======
        public async Task<IActionResult> RescheduleAppointment(Guid id, ReschduleAppointment dto)
        {

>>>>>>> 230c220864a825afec575f0000ab00412668c75f
            var patientId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(patientId)) return Unauthorized();

            Guid patientGuid = Guid.Parse(patientId);
<<<<<<< HEAD

            
            var appointment = await _appointmentRepo.GetOneAsynch(
                filter: a => a.Id == id && a.PatientId == patientGuid
=======
            var patient = await _patient.GetOneAsynch(filter: p => p.UserId == patientGuid);
            if (patient == null) return Unauthorized();


            var appointment = await _appointment.GetOneAsynch(
                filter: a => a.Id == id && a.PatientId == patient.PatientId
>>>>>>> 230c220864a825afec575f0000ab00412668c75f
            );

            if (appointment == null)
            {
                return NotFound(new ApiResponse<MedicalRecord>
                {
                    IsSuccess = false,
                    Message = "Appoint not found",

                });
            }

<<<<<<< HEAD
            
=======

>>>>>>> 230c220864a825afec575f0000ab00412668c75f
            if (appointment.Status == AppointmentStatus.Cancelled || appointment.Status == AppointmentStatus.Completed)
            {
                return BadRequest(new { Message = "Cannot reschedule an appointment with this status" });
            }

<<<<<<< HEAD
            
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
=======
            // Check if the new slot is already booked
            var newDate = DateOnly.FromDateTime(dto.NewAppointmentDate);
            var newStartTime = TimeOnly.FromTimeSpan(dto.NewStartTime);
            
            var existingAppointment = await _appointment.GetOneAsynch(filter: a => 
                a.DoctorId == appointment.DoctorId && 
                a.AppointmentDate == newDate && 
                a.StartTime == newStartTime &&
                a.Status != AppointmentStatus.Cancelled);

            if (existingAppointment != null && existingAppointment.Id != appointment.Id)
            {
                return BadRequest(new { Message = "The new time slot is already booked." });
            }

            appointment.AppointmentDate = newDate;
            appointment.StartTime = newStartTime;
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
>>>>>>> 230c220864a825afec575f0000ab00412668c75f
