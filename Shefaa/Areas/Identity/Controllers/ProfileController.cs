
namespace Shefaa.Areas.Identity.Controllers
{
    [Area(CD.IDENTITY_AREA)]
    [Route("api/[area]/[controller]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public ProfileController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }
        [HttpGet]
        public async Task<IActionResult> GetInfo()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user is null)
            {
                return NotFound(new ApiResponse<object>()
                {
                    IsSuccess = false,
                    Message = "Invalid User"
                });
            }
            var applicationUserResponse = user.Adapt<ApplicationUserResponse>();
            return Ok(new ApiResponse<ApplicationUserResponse>()
            {
                IsSuccess = true,
                Message = "data Returned successfully",
                Data = applicationUserResponse
            });
        }
        [HttpPost("UpdateProfile")]
        public async Task<IActionResult> UpdateProfile(ApplicationUserRequest applicationUserRequest)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user is null)
            {
                return NotFound(new ApiResponse<object>()
                {
                    IsSuccess = false,
                    Message = "Invalid User"
                });
            }
            user.FirstName = applicationUserRequest.FirstName;
            user.LastName = applicationUserRequest.LastName;
            user.Gender = applicationUserRequest.Gender;
            user.DateOfBirth = applicationUserRequest.DateOfBirth;
            user.PhoneNumber = applicationUserRequest.PhoneNumber;

            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
            {
                return BadRequest(new ApiResponse<object>()
                {
                    IsSuccess = false,
                    Message = "Invalid data",
                    Errors = result.Errors.Select(e => e.Description)
                });
            }
            return Ok(new ApiResponse<object>()
            {
                IsSuccess = true,
                Message = "updated user Successfully",
            });
        }
        [HttpPost("UpdatePassword")]
        public async Task<IActionResult> UpdatePassword(ApplicationUserRequest applicationUserVM)
        {
            if (string.IsNullOrEmpty(applicationUserVM.CurrentPassword) || string.IsNullOrEmpty(applicationUserVM.NewPassword))
            {
                return BadRequest(new ApiResponse<object>()
                {
                    IsSuccess = false,
                    Message = "Current password and new password are required."
                });
            }

            var user = await _userManager.GetUserAsync(User);
            if (user is null)
            {
                return NotFound(new ApiResponse<object>()
                {
                    IsSuccess = false,
                    Message = "Invalid User"
                });
            }

            var result = await _userManager.ChangePasswordAsync(user, applicationUserVM.CurrentPassword, applicationUserVM.NewPassword);

            if (!result.Succeeded)
            {
                return BadRequest(new ApiResponse<object>()
                {
                    IsSuccess = false,
                    Message = "Invalid data",
                    Errors = result.Errors.Select(e => e.Description)
                });
            }
            return Ok(new ApiResponse<object>()
            {
                IsSuccess = true,
                Message = "change password Successfully",
            });
        }

    }

}

