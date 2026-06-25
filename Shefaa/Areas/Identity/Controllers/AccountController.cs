using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Shefaa.Repositories;
using Shefaa.DTOs.Request;
using Shefaa.DTOs.Response;


namespace Shefaa.Areas.Identity.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        UserManager<ApplicationUser> _userManager;
        SignInManager<ApplicationUser> _signInManager;

        private readonly IEmailSender _emailSender;

        IRepository<ApplicationUserOTP> _applicationUserOTP;

        public AccountController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IRepository<ApplicationUserOTP> applicationUserOTP, IEmailSender emailSender)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _emailSender = emailSender;
            _applicationUserOTP = applicationUserOTP;

        }

        [HttpPost]
        public async Task<IActionResult> Register(Shefaa.DTOs.Request.RegisterRequest registerRequest)
        {

            ApplicationUser user = new ApplicationUser()
            {
                FirstName = registerRequest.FirstName,
                LastName = registerRequest.LastName,
                Email = registerRequest.Email,
                UserName = registerRequest.UserName,
                DateOfBirth = registerRequest.DateOfBirth
            };
            var result = await _userManager.CreateAsync(user, registerRequest.Password);


            if (!result.Succeeded)
            {
                return BadRequest(new ApiResponse<Object>()
                {
                    IsSuccess = false,
                    Message = "User registration failed!",
                    Errors = result.Errors.Select(e => e.Description)
                });

            }
            var Token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var link = Url.Action(nameof(ConfirmEmail), "Account", new { area = "Identity", userId = user.Id, Token });
            await _emailSender.SendEmailAsync(registerRequest.Email, "Confirm your email", $"Please confirm your email by clicking on this link: <a href='{link}'>Confirm Email</a>");
            return RedirectToAction("Login", "Account", new { area = "Identity" });
        }

        [HttpPost]
        public async Task<IActionResult> ConfirmEmail(string UserId, string Token)
        {
            var user = await _userManager.FindByIdAsync(UserId);
            if (user == null)
            {
                return NotFound();
                //TempData["Error"] = "User not found!";
                return RedirectToAction("Login", "Account", new { area = "Identity" });

            }
            // var Token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var Result = await _userManager.ConfirmEmailAsync(user, Token);
            if (!Result.Succeeded)
            {
                //TempData["Error"] = "Email confirmation failed!";
            }
            //TempData["Success"] = "Email confirmed successfully!";

            return RedirectToAction("Login", "Account", new { area = "Identity" });
        }
    }
}
