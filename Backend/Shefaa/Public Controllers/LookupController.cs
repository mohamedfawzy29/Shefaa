using Microsoft.AspNetCore.Mvc;
using Shefaa.DTOs.Response;
using Shefaa.Models;
using Shefaa.Repositories;

namespace Shefaa.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LookupController : ControllerBase
    {
        private readonly IRepository<Specialization> _specializations;
        private readonly IRepository<Branch> _branches;
        private readonly IRepository<Organization> _organizations;
        private readonly IRepository<Doctor> _doctors;
        private readonly IRepository<Patient> _patients;
        private readonly IRepository<Receptionist> _receptionists;

        public LookupController(
            IRepository<Specialization> specializations,
            IRepository<Branch> branches,
            IRepository<Organization> organizations,
            IRepository<Doctor> doctors,
            IRepository<Patient> patients,
            IRepository<Receptionist> receptionists)
        {
            _specializations = specializations;
            _branches = branches;
            _organizations = organizations;
            _doctors = doctors;
            _patients = patients;
            _receptionists = receptionists;
        }

        [AllowAnonymous]
        [HttpGet("Specializations")]
        public async Task<IActionResult> GetSpecializations()
        {
            var data = await _specializations.GetAsync();

            return Ok(new ApiResponse<IEnumerable<LookupResponse>>
            {
                IsSuccess = true,
                Data = data
                    .OrderBy(x => x.Name)
                    .Select(x => new LookupResponse
                    {
                        Id = x.Id,
                        Name = x.Name
                    })
            });
        }

        [AllowAnonymous]
        [HttpGet("Branches")]
        public async Task<IActionResult> GetBranches()
        {
            var data = await _branches.GetAsync(
                b => b.IsActive);

            return Ok(new ApiResponse<IEnumerable<LookupResponse>>
            {
                IsSuccess = true,
                Data = data
                    .OrderBy(x => x.BranchName)
                    .Select(x => new LookupResponse
                    {
                        Id = x.Id,
                        Name = x.BranchName,
                        OrganizationId = x.OrganizationId
                    })
            });
        }

        [HttpGet("Organizations")]
        public async Task<IActionResult> GetOrganizations()
        {
            var data = await _organizations.GetAsync(
                o => o.Status == "Active");

            return Ok(new ApiResponse<IEnumerable<LookupResponse>>
            {
                IsSuccess = true,
                Data = data
                    .OrderBy(x => x.LegalName)
                    .Select(x => new LookupResponse
                    {
                        Id = x.Id,
                        Name = x.LegalName
                    })
            });
        }

        [HttpGet("Doctors")]
        public async Task<IActionResult> GetDoctors()
        {
            var data = await _doctors.GetAsync(
                d => d.Status == DoctorStatus.Approved &&
                     d.User.IsActive,
                includes: [d => d.User]);

            return Ok(new ApiResponse<IEnumerable<LookupResponse>>
            {
                IsSuccess = true,
                Data = data
                    .OrderBy(x => x.User.FirstName)
                    .ThenBy(x => x.User.LastName)
                    .Select(x => new LookupResponse
                    {
                        Id = x.DoctorId,
                        Name = $"{x.User.FirstName} {x.User.LastName}"
                    })
            });
        }

        [HttpGet("Patients")]
        public async Task<IActionResult> GetPatients()
        {
            var data = await _patients.GetAsync(
                p => p.User.IsActive,
                includes: [p => p.User]);

            return Ok(new ApiResponse<IEnumerable<LookupResponse>>
            {
                IsSuccess = true,
                Data = data
                    .OrderBy(x => x.User.FirstName)
                    .ThenBy(x => x.User.LastName)
                    .Select(x => new LookupResponse
                    {
                        Id = x.PatientId,
                        Name = $"{x.User.FirstName} {x.User.LastName}"
                    })
            });
        }

        [HttpGet("Receptionists")]
        public async Task<IActionResult> GetReceptionists()
        {
            var data = await _receptionists.GetAsync(
                r => r.Status == ReceptionistStatus.Approved &&
                     r.User.IsActive,
                includes: [r => r.User]);

            return Ok(new ApiResponse<IEnumerable<LookupResponse>>
            {
                IsSuccess = true,
                Data = data
                    .OrderBy(x => x.User.FirstName)
                    .ThenBy(x => x.User.LastName)
                    .Select(x => new LookupResponse
                    {
                        Id = x.ReceptionistId,
                        Name = $"{x.User.FirstName} {x.User.LastName}"
                    })
            });
        }
    }
}