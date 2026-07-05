using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shefaa.DTOs.Request;
using Shefaa.DTOs.Response;
using Shefaa.Models;
using Shefaa.Repositories;
using Shefaa.Utilites;

namespace Shefaa.Areas.Admin.Controllers
{
    [Area(CD.ADMIN_AREA)]
    [Route("api/[area]/[controller]")]
    [ApiController]
    //[Authorize(Roles = CD.ADMIN_ROLE)]
    public class BranchesController : ControllerBase
    {
        private readonly IRepository<Branch> _branchRepository;
        private readonly IRepository<Organization> _organizationRepository;

        public BranchesController(
            IRepository<Branch> branchRepository,
            IRepository<Organization> organizationRepository)
        {
            _branchRepository = branchRepository;
            _organizationRepository = organizationRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var branches = await _branchRepository.GetAsync(includes: [b => b.Organization]);

            var response = branches.Adapt<List<BranchResponse>>();

            return Ok(new ApiResponse<IEnumerable<BranchResponse>>
            {
                IsSuccess = true,
                Message = "Branches retrieved successfully",
                Data = response
            });
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var branch = await _branchRepository.GetOneAsynch(b => b.Id == id, includes: [b => b.Organization]);

            if (branch == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Branch not found"
                });
            }

            var response = branch.Adapt<BranchResponse>();

            return Ok(new ApiResponse<BranchResponse>
            {
                IsSuccess = true,
                Message = "Branch retrieved successfully",
                Data = response
            });
        }


        [HttpPost]
        public async Task<IActionResult> Create(CreateBranchRequest request)
        {
            var branch = request.Adapt<Branch>();
            if (branch == null)
            {
                return BadRequest(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Invalid branch data"
                });
            }
            if (await _branchRepository.ExistsAsync(b => b.BranchEmail == branch.BranchEmail && b.Country == branch.Country && b.OrganizationId == branch.OrganizationId && b.BranchName == branch.BranchName))
            {
                return BadRequest(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Branch already exists"
                });
            }

            var organization = await _organizationRepository.GetOneAsynch(o => o.Id == branch.OrganizationId);
            if (organization == null)
            {
                return BadRequest(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Organization not found"
                });
            }
            branch.Organization = organization;

            await _branchRepository.AddAsync(branch);
            await _branchRepository.CommitChangesAsync();

            var response = branch.Adapt<BranchResponse>();

            return CreatedAtAction(nameof(GetById), new { id = branch.Id },
                new ApiResponse<BranchResponse>
                {
                    IsSuccess = true,
                    Message = "Branch created successfully",
                    Data = response
                });
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, UpdateBranchRequest request)
        {
            var branch = await _branchRepository.GetOneAsynch(b => b.Id == id, trackChanges: true, includes: [b => b.Organization]);

            if (branch == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Branch not found"
                });
            }

            request.Adapt(branch);

            if (!await _organizationRepository.ExistsAsync(o => o.Id == branch.OrganizationId))
            {
                return BadRequest(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "New Organization not found"
                });
            }

            await _branchRepository.CommitChangesAsync();

            return Ok(new ApiResponse<BranchResponse>
            {
                IsSuccess = true,
                Message = "Branch updated successfully",
                Data = branch.Adapt<BranchResponse>()
            });
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var branch = await _branchRepository.GetOneAsynch(b => b.Id == id, trackChanges: true);

            if (branch == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Branch not found"
                });
            }

            _branchRepository.Delete(branch);
            await _branchRepository.CommitChangesAsync();

            return Ok(new ApiResponse<object>
            {
                IsSuccess = true,
                Message = "Branch deleted successfully"
            });
        }
    }
}
