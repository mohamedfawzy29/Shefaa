
namespace Shefaa.Areas.Admin.Controllers
{
    [Area(CD.ADMIN_AREA)]
    [Route("api/[area]/[controller]")] 
    [ApiController]
    [Authorize(Roles = CD.ADMIN_ROLE)]
    public class UserManagementController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<ApplicationRole> _roleManager;

        public UserManagementController(UserManager<ApplicationUser> userManager, RoleManager<ApplicationRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        [HttpPost("AssignRoles")]
        public async Task<IActionResult> AssignRoles([FromBody] AssignRolesRequest request)
        {

            var user = await _userManager.FindByIdAsync(request.UserId.ToString());
            if (user == null)
            {
                return NotFound(new ApiResponse<object>()
                {
                    IsSuccess = false,
                    Message = "User Not Found"
                });
            }

            foreach (var roleName in request.Roles)
            {
                var roleExists = await _roleManager.RoleExistsAsync(roleName);
                if (!roleExists)
                {
                    return BadRequest(new ApiResponse<object>()
                    {
                        IsSuccess = false,
                        Message = $"The role '{roleName}' does not exist in the system!"
                    });
                }
            }

            var currentRoles = await _userManager.GetRolesAsync(user);
            var removeResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);
            if (!removeResult.Succeeded)
            {
                return BadRequest(new ApiResponse<object>()
                {
                    IsSuccess = false,
                    Message = "Failed to clear old roles",
                    Errors = removeResult.Errors.Select(e => e.Description)
                });
            }

            var addResult = await _userManager.AddToRolesAsync(user, request.Roles);
            if (!addResult.Succeeded)
            {
                return BadRequest(new ApiResponse<object>()
                {
                    IsSuccess = false,
                    Message = "Failed to assign new roles",
                    Errors = addResult.Errors.Select(e => e.Description)
                });
            }

            return Ok(new ApiResponse<object>()
            {
                IsSuccess = true,
                Message = "Roles assigned successfully to the user"
            });
        }

        [HttpPost("LockUser/{id}")]
        public async Task<IActionResult> LockUser(Guid id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
            {
                return NotFound(new ApiResponse<object>()
                {
                    IsSuccess = false,
                    Message = "User Not Found"
                });
            }

            
            var lockResult = await _userManager.SetLockoutEndDateAsync(user, DateTimeOffset.UtcNow.AddYears(100));

            if (!lockResult.Succeeded)
            {
                return BadRequest(new ApiResponse<object>()
                {
                    IsSuccess = false,
                    Message = "Failed to lock user",
                    Errors = lockResult.Errors.Select(e => e.Description)
                });
            }

            return Ok(new ApiResponse<object>()
            {
                IsSuccess = true,
                Message = "User has been locked successfully out of Shefaa system."
            });
        }

        [HttpPost("UnlockUser/{id}")]
        public async Task<IActionResult> UnlockUser(Guid id)
        {

            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
            {
                return NotFound(new ApiResponse<object>()
                {
                    IsSuccess = false,
                    Message = "User Not Found"
                });
            }

            var unlockResult = await _userManager.SetLockoutEndDateAsync(user, null);

            if (!unlockResult.Succeeded)
            {
                return BadRequest(new ApiResponse<object>()
                {
                    IsSuccess = false,
                    Message = "Failed to unlock user",
                    Errors = unlockResult.Errors.Select(e => e.Description)
                });
            }

            return Ok(new ApiResponse<object>()
            {
                IsSuccess = true,
                Message = "User has been unlocked successfully. They can login now."
            });
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userManager.Users.ToListAsync();
            var userResponses = new List<UserResponse>();
            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                userResponses.Add(new UserResponse
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    Role = roles.FirstOrDefault() ?? string.Empty,
                    ProfileImageUrl = $"{Request.Scheme}://{Request.Host}/images/profiles/{user.ProfileImg}",
                    IsLockedOut = await _userManager.IsLockedOutAsync(user),
                    IsActive = user.IsActive,
                    PhoneNumbers = user.PhoneNumbers
                });
            }
            return Ok(new ApiResponse<List<UserResponse>>()
            {
                IsSuccess = true,
                Message = "Users retrieved successfully",
                Data = userResponses
            });
        }
    }
}