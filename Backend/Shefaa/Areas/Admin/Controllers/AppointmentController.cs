using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Shefaa.Areas.Admin.Controllers
{
    [Area(CD.ADMIN_AREA)]
    [Route("api/[controller]")]
    [Authorize(Roles = CD.ADMIN_ROLE)]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        IRepository<Appointment> _appointmentRepository;

        public AppointmentController(IRepository<Appointment> appointmentRepository)
        {
            _appointmentRepository = appointmentRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAppointments()
        {
            var appointments = await _appointmentRepository.GetAsync(includes: [a => a.Patient, a => a.Patient.User, a => a.Doctor, a => a.Doctor.User, a => a.Branch]);
            var response = new List<AppointmentResponse>();

            foreach (var appointment in appointments)
            {
                response.Add(new AppointmentResponse
                {
                    AppointmentId = appointment.Id,
                    PatientName = $"{appointment.Patient.User.FirstName} {appointment.Patient.User.LastName}",
                    DoctorName = $"{appointment.Doctor.User.FirstName} {appointment.Doctor.User.LastName}",
                    BranchName = appointment.Branch.BranchName,
                    AppointmentDate = appointment.AppointmentDate,
                    StartTime = appointment.StartTime,
                    EndTime = appointment.EndTime,
                    VisitReason = appointment.VisitReason,
                    Notes = appointment.Notes,
                    Status = appointment.Status,
                    CreatedAt = appointment.CreatedAt,
                    UpdatedAt = appointment.UpdatedAt,
                    CancelledAt = appointment.CancelledAt
                });
            }

            return Ok(new ApiResponse<List<AppointmentResponse>>
            {
                IsSuccess = true,
                Message = "Appointments retrieved successfully.",
                Data = response
            });
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetAppointmentById(Guid id)
        {
            var appointment = await _appointmentRepository.GetOneAsynch( a => a.Id == id, includes: [a => a.Patient, a => a.Patient.User, a => a.Doctor, a => a.Doctor.User, a => a.Branch]);

            if (appointment == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Appointment not found."
                });
            }

            var response = new AppointmentResponse
            {
                AppointmentId = appointment.Id,
                PatientName = $"{appointment.Patient.User.FirstName} {appointment.Patient.User.LastName}",
                DoctorName = $"{appointment.Doctor.User.FirstName} {appointment.Doctor.User.LastName}",
                BranchName = appointment.Branch.BranchName,
                AppointmentDate = appointment.AppointmentDate,
                StartTime = appointment.StartTime,
                EndTime = appointment.EndTime,
                VisitReason = appointment.VisitReason,
                Notes = appointment.Notes,
                Status = appointment.Status,
                CreatedAt = appointment.CreatedAt,
                UpdatedAt = appointment.UpdatedAt,
                CancelledAt = appointment.CancelledAt
            };

            return Ok(new ApiResponse<AppointmentResponse>
            {
                IsSuccess = true,
                Message = "Appointment retrieved successfully.",
                Data = response
            });
        }
    }
}
