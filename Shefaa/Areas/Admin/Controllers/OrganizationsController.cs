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
    [Authorize(Roles = CD.ADMIN_ROLE)]
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

            var response = organizations.Select(o => new OrganizationResponse
            {
                Id = o.Id,
                LegalName = o.LegalName,
                TaxNumber = o.TaxNumber,
                CommercialRegistrationNumber = o.CommercialRegistrationNumber,
                MainEmail = o.MainEmail,
                MainPhone = o.MainPhone,
                LogoImg = o.LogoImg,
                WebsiteUrl = o.WebsiteUrl,
                Status = o.Status
            });

            return Ok(new ApiResponse<IEnumerable<OrganizationResponse>>
            {
                IsSuccess = true,
                Message = "Organizations retrieved successfully.",
                Data = response
            });
        }
    }
}
