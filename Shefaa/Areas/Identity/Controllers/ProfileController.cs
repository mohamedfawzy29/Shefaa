
using Shefaa.DTOs.Request.Shefaa.DTOs.Request;
using Stripe;

namespace Shefaa.Areas.Identity.Controllers
{
    [Authorize]
    [Area(CD.IDENTITY_AREA)]
    [Route("api/[area]/[controller]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        UserManager<ApplicationUser> _userManager;
        IApplicationUserService _applicationUserService;
        IRepository<UserPhoneNumber> _userPhoneNumbersRepository;
        IFileService _fileService;

        public ProfileController(UserManager<ApplicationUser> userManager, IApplicationUserService applicationUserService, IRepository<UserPhoneNumber> userPhoneNumbersRepository, IFileService fileService)
        {
            _userManager = userManager;
            _applicationUserService = applicationUserService;
            _userPhoneNumbersRepository = userPhoneNumbersRepository;
            _fileService = fileService;
        }

        [HttpGet]
        public async Task<IActionResult> GetProfile()
        {
            var user = await _userManager.GetUserAsync(User);

            if (user is null)
            {
                return NotFound(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Authenticated user not found."
                });
            }

            var phoneNumbers = await _userPhoneNumbersRepository.GetAsync(p => p.UserId == user.Id);

            var response = new ApplicationUserResponse
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                UserName = user.UserName!,
                Email = user.Email!,
                Gender = user.Gender,
                DateOfBirth = user.DateOfBirth,
                ProfileImg = user.ProfileImg,
                PhoneNumbers = phoneNumbers.Select(p => p.PhoneNumber).ToList()
            };

            return Ok(new ApiResponse<ApplicationUserResponse>
            {
                IsSuccess = true,
                Message = "Profile retrieved successfully.",
                Data = response
            });
        }

        [HttpPut]
        public async Task<IActionResult> UpdateProfile(UpdateProfileRequest request)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user is null)
            {
                return NotFound(new ApiResponse<object>()
                {
                    IsSuccess = false,
                    Message = "Authenticated User not found"
                });
            }
            user.FirstName = request.FirstName;
            user.LastName = request.LastName;
            user.Gender = request.Gender;
            user.DateOfBirth = request.DateOfBirth;

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

            await _applicationUserService.UpdateUserPhoneNumbersAsync(user.Id, request.PhoneNumbers);

            var response = new ApplicationUserResponse
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                UserName = user.UserName!,
                Email = user.Email!,
                Gender = user.Gender,
                DateOfBirth = user.DateOfBirth,
                ProfileImg = user.ProfileImg,
                PhoneNumbers = request.PhoneNumbers
            };

            return Ok(new ApiResponse<ApplicationUserResponse>
            {
                IsSuccess = true,
                Message = "Profile updated successfully.",
                Data = response
            });
        }

        [HttpPut("Password")]
        public async Task<IActionResult> UpdatePassword(ChangePasswordRequest request)
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

            if (request.NewPassword != request.ConfirmPassword)
            {
                return BadRequest(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "New password and confirm password do not match."
                });
            }

            var changePasswordResult = await _userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);

            if (!changePasswordResult.Succeeded)
            {
                return BadRequest(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Failed to change password.",
                    Errors = changePasswordResult.Errors.Select(e => e.Description)
                });
            }

            return Ok(new ApiResponse<object>
            {
                IsSuccess = true,
                Message = "Password changed successfully."
            });
        }

        [HttpPatch("ProfileImage")]
        public async Task<IActionResult> UpdateProfileImage([FromForm] UpdateProfileImageRequest request)
        {
            var user = await _userManager.GetUserAsync(User);

            if (user is null)
            {
                return NotFound(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Authenticated user not found."
                });
            }

            var oldImage = user.ProfileImg;
            string newImage = string.Empty;

            try
            {
                newImage = await _fileService.UploadProfileImageAsync(request.ProfileImage);
                user.ProfileImg = newImage;
                var updateResult = await _userManager.UpdateAsync(user);

                if (!updateResult.Succeeded)
                {
                    await _fileService.DeleteProfileImageAsync(newImage);

                    return BadRequest(new ApiResponse<object>
                    {
                        IsSuccess = false,
                        Message = "Failed to update profile image.",
                        Errors = updateResult.Errors.Select(e => e.Description)
                    });
                }

                if (!string.IsNullOrWhiteSpace(oldImage) && oldImage != "default.png")
                {
                    await _fileService.DeleteProfileImageAsync(oldImage);
                }

                return Ok(new ApiResponse<object>
                {
                    IsSuccess = true,
                    Message = "Profile image updated successfully.",
                    Data = new
                    {
                        ProfileImage = user.ProfileImg
                    }
                });
            }
            catch (Exception ex)
            {
                if (!string.IsNullOrWhiteSpace(newImage))
                {
                    await _fileService.DeleteProfileImageAsync(newImage);
                }

                return StatusCode(StatusCodes.Status500InternalServerError,
                    new ApiResponse<object>
                    {
                        IsSuccess = false,
                        Message = ex.Message
                    });
            }
        }

    }

}

