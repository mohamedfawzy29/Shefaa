using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Shefaa.DTOs.Request;
using Shefaa.DTOs.Response;
using Shefaa.Models;
using Shefaa.Repositories;
using Shefaa.Utilites;

namespace Shefaa.Areas.Admin.Controllers
{
    [Area(CD.ADMIN_AREA)]
    [Route("api/[controller]")]
    //[Authorize(Roles = CD.ADMIN_ROLE)]
    [ApiController]
    public class OrganizationsController : ControllerBase
    {
        private readonly IRepository<Organization> _organizationRepository;

        public OrganizationsController(IRepository<Organization> organizationRepository)
        {
            _organizationRepository = organizationRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var organizations = await _organizationRepository.GetAsync();

            var response = organizations.Adapt<List<OrganizationResponse>>();

            return Ok(new ApiResponse<IEnumerable<OrganizationResponse>>
            {
                IsSuccess = true,
                Message = "Organizations retrieved successfully",
                Data = response
            });
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var organization = await _organizationRepository.GetOneAsynch(o => o.Id == id);

            if (organization == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Organization not found"
                });
            }

            var response = organization.Adapt<OrganizationResponse>();

            return Ok(new ApiResponse<OrganizationResponse>
            {
                IsSuccess = true,
                Message = "Organization retrieved successfully",
                Data = organization.Adapt<OrganizationResponse>()
            });
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateOrganizationRequest request)
        {
            var organization = request.Adapt<Organization>();

            if (organization == null)
            {
                return BadRequest(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Invalid organization data"
                });
            }
            if (await _organizationRepository.ExistsAsync(o => o.LegalName == organization.LegalName && o.TaxNumber == organization.TaxNumber && o.CommercialRegistrationNumber == organization.CommercialRegistrationNumber))
            {
                return Conflict(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "this organization already exists"
                });
            }

            await _organizationRepository.AddAsync(organization);
            await _organizationRepository.CommitChangesAsync();

            var response = organization.Adapt<OrganizationResponse>();

            return CreatedAtAction(nameof(GetById), new { id = organization.Id },
                new ApiResponse<OrganizationResponse>
                {
                    IsSuccess = true,
                    Message = "Organization created successfully",
                    Data = organization.Adapt<OrganizationResponse>()
                });
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, UpdateOrganizationRequest request)
        {
            var organization = await _organizationRepository.GetOneAsynch(o => o.Id == id, trackChanges: true);

            if (organization == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Organization not found"
                });
            }

            request.Adapt(organization);

            await _organizationRepository.CommitChangesAsync();

            return Ok(new ApiResponse<OrganizationResponse>
            {
                IsSuccess = true,
                Message = "Organization updated successfully",
                Data = organization.Adapt<OrganizationResponse>()
            });
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var organization = await _organizationRepository.GetOneAsynch( o => o.Id == id, trackChanges: true);

            if (organization == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Organization not found"
                });
            }

            _organizationRepository.Delete(organization);
            await _organizationRepository.CommitChangesAsync();

            return Ok(new ApiResponse<object>
            {
                IsSuccess = true,
                Message = "Organization deleted successfully"
            });
        }
    }
}
