
using Shefaa.Services;
using Stripe;

namespace Shefaa.Areas.Identity.Controllers
{
    [Area(CD.IDENTITY_AREA)]
    [Route("api/[area]/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        UserManager<ApplicationUser> _userManager;
        SignInManager<ApplicationUser> _signInManager;
        IEmailSender _emailSender;
        IRepository<ApplicationUserOTP> _applicationUserOTP;
        IJwtHandler _jwtHandler;
        IFileService _fileService;
        IRepository<Patient> _patientRepository;
        IRepository<Doctor> _doctorRepository;
        IRepository<Specialization> _specializationRepository;

        private ApplicationUser CreateApplicationUser(string firstName,string lastName,string email,string userName,Gender gender,DateOnly dateOfBirth,string profileImg)
        {
            return new ApplicationUser
            {
                FirstName = firstName,
                LastName = lastName,
                Email = email,
                UserName = userName,
                Gender = gender,
                DateOfBirth = dateOfBirth,
                ProfileImg = profileImg,
                IsActive = true,
                EmailConfirmed = false
            };
        }

        public AccountController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IEmailSender emailSender, IRepository<ApplicationUserOTP> applicationUserOTP, IJwtHandler jwtHandler, IFileService fileService, IRepository<Patient> patientRepository, IRepository<Doctor> doctorRepository, IRepository<Specialization> specializationRepository)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _emailSender = emailSender;
            _applicationUserOTP = applicationUserOTP;
            _jwtHandler = jwtHandler;
            _fileService = fileService;
            _patientRepository = patientRepository;
            _doctorRepository = doctorRepository;
            _specializationRepository = specializationRepository;
        }

        [HttpPost("RegisterPatient")]
        public async Task<IActionResult> RegisterPatient([FromForm] RegisterPatientRequest request)
        {
            string profileImage = "default.png";

            try
            {
                profileImage = await _fileService.UploadProfileImageAsync(request.ProfileImg);

                var user = CreateApplicationUser(
                    request.FirstName,
                    request.LastName,
                    request.Email,
                    request.UserName,
                    request.Gender,
                    request.DateOfBirth,
                    profileImage);

                var createUserResult = await _userManager.CreateAsync(user, request.Password);

                if (!createUserResult.Succeeded)
                {
                    await _fileService.DeleteProfileImageAsync(profileImage);

                    return BadRequest(new ApiResponse<object>
                    {
                        IsSuccess = false,
                        Message = "Registration failed.",
                        Errors = createUserResult.Errors.Select(e => e.Description)
                    });
                }

                var addRoleResult = await _userManager.AddToRoleAsync(user, CD.PATIENT_ROLE);

                if (!addRoleResult.Succeeded)
                {
                    await _userManager.DeleteAsync(user);
                    await _fileService.DeleteProfileImageAsync(profileImage);

                    return BadRequest(new ApiResponse<object>
                    {
                        IsSuccess = false,
                        Message = "Failed to assign role.",
                        Errors = addRoleResult.Errors.Select(e => e.Description)
                    });
                }

                var patient = new Patient
                {
                    UserId = user.Id,
                    Address = request.Address,
                    NationalId = request.NationalId,
                    EmergencyContact = request.EmergencyContact,
                    BloodType = request.BloodType
                };

                try
                {
                    await _patientRepository.AddAsync(patient);
                    await _patientRepository.CommitChangesAsync();
                }
                catch
                {
                    await _userManager.DeleteAsync(user);
                    await _fileService.DeleteProfileImageAsync(profileImage);
                    throw;
                }

                var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);

                var confirmationLink = Url.Action(
                    nameof(ConfirmEmail),
                    "Account",
                    new
                    {
                        UserId = user.Id,
                        Token = token
                    },
                    Request.Scheme);

                await _emailSender.SendEmailAsync(
                    user.Email!,
                    "Confirm your email",
                    $"Please confirm your email by clicking <a href='{confirmationLink}'>here</a>");

                return Ok(new ApiResponse<object>
                {
                    IsSuccess = true,
                    Message = "Registration completed successfully. Please check your email to confirm your account."
                });
            }
            catch (Exception ex)
            {
                await _fileService.DeleteProfileImageAsync(profileImage);

                return StatusCode(StatusCodes.Status500InternalServerError,
                    new ApiResponse<object>
                    {
                        IsSuccess = false,
                        Message = ex.Message
                    });
            }
        }




        [HttpGet("ConfirmEmail")]
        public async Task<IActionResult> ConfirmEmail(string UserId, string Token)
        {
            var user = await _userManager.FindByIdAsync(UserId);
            if (user is null)
            {
                return NotFound(new ApiResponse<object>()
                {
                    IsSuccess = false,
                    Message = "Invalid User"
                });
            }
            var result = await _userManager.ConfirmEmailAsync(user, Token);
            if (!result.Succeeded)
            {
                return BadRequest(new ApiResponse<object>()
                {
                    IsSuccess = false,
                    Message = "error when  Confirm Email",
                    Errors = result.Errors.Select(e => e.Description)
                });
            }
            return Ok(new ApiResponse<object>()
            {
                IsSuccess = true,
                Message = "Email Confirmed successfully",
            });
        }
        [HttpPost("Login")]
        public async Task<IActionResult> Login(DTOs.Request.LoginRequest loginRequest)
        {
            var user = await _userManager.FindByEmailAsync(loginRequest.UserNameOrEmail) ??
                        await _userManager.FindByNameAsync(loginRequest.UserNameOrEmail);

            if (user == null)
            {
                return NotFound(new ApiResponse<object>()
                {
                    IsSuccess = false,
                    Message = "invalid UserName Or Email Or Password"
                });
            }
            var result = await _signInManager.PasswordSignInAsync(user, loginRequest.Password, loginRequest.RememberMe, true);
            if (!result.Succeeded)
            {
                List<string> errors = new List<string>();
                if (result.IsLockedOut)
                {
                    errors.Add("to many attempts try again later");
                }
                if (result.IsNotAllowed)
                {
                    errors.Add("please Confirm Your Email");
                }
                else
                {
                    errors.Add("invalid UserName Or Email Or Password");
                }
                return BadRequest(new ApiResponse<object>()
                {
                    IsSuccess = false,
                    Message = "Login Failed",
                    Errors = errors
                });
            }
            var token = await _jwtHandler.GenerateAccessTokenAsync(user);
            return Ok(new AuthenticatedResponse()
            {
                AccessToken = token
           });
        }
        
        [HttpPost("ResendEmailConfirmation")]
        public async Task<IActionResult> ResendEmailConfirmation(ResendEmailConfirmationRequest resendEmailConfirmationRequest)
        {
            var user = await _userManager.FindByEmailAsync(resendEmailConfirmationRequest.UserNameOrEmail) ??
                       await _userManager.FindByNameAsync(resendEmailConfirmationRequest.UserNameOrEmail);
            if (user == null)
            {
                return NotFound(new ApiResponse<object>()
                {
                    IsSuccess = false,
                    Message = "Invalid User"
                });
            }
            if (user.EmailConfirmed)
            {
                return BadRequest(new ApiResponse<object>()
                {
                    IsSuccess = false,
                    Message = "Your  Email is Already Confirmed"
                });
            }
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var link = Url.Action(nameof(ConfirmEmail), "Account", new { area = "Identity", userId = user.Id, token }, Request.Scheme);
            await _emailSender.SendEmailAsync(
                user.Email,
                "Confirm Your Email from Ecommerce525",
                $"<h1> click <a href= {link} > here </a> to confirm your mail </h1>"
                );
            return Ok(new ApiResponse<object>()
            {
                IsSuccess = true,
                Message = "Resend Email Comfiramtion successfully"
            });
        }
        [HttpPost("ForgetPassword")]
        public async Task<IActionResult> ForgetPassword(ForgetPasswordRequest forgetPasswordRequest)
        {
            var user = await _userManager.FindByEmailAsync(forgetPasswordRequest.UserNameOrEmail) ??
                      await _userManager.FindByNameAsync(forgetPasswordRequest.UserNameOrEmail);
            if (user == null)
            {
                return NotFound(new ApiResponse<object>()
                {
                    IsSuccess = false,
                    Message = "Invalid User"
                });
            }
            var otp = new Random().Next(1000, 9999).ToString();
            var applicationUserOtp = new ApplicationUserOTP(otp, user.Id);

            await _applicationUserOTP.AddAsync(applicationUserOtp);
            await _applicationUserOTP.CommitChangesAsync();

            await _emailSender.SendEmailAsync(
                user.Email,
                "Reset your password",
                $"<h1> use this <span style= \"color: red\" >{otp}</span> to Reset your password </h1>"
                );
            return Ok(new ApiResponse<object>()
            {
                IsSuccess = true,
                Message = "Email Send with OTP successfully"
            });
           
        }
        [HttpPost("VerifyOTP")]
        public async Task<IActionResult> VerifyOTP(VerifyOTPRequest verifyOTPVM)
        {
            var user = await _userManager.FindByIdAsync(verifyOTPVM.UserId);
            if (user == null)
            {
                return NotFound(new ApiResponse<object>()
                {
                    IsSuccess = false,
                    Message = "Invalid User"
                });
            }
            var otps = await _applicationUserOTP.GetAsync(e =>
                e.ApplicationUserId == user.Id &&
                e.IsValid == true &&
                DateTime.UtcNow < e.Validto
                );
           
            var otp = otps.OrderByDescending(e => e.CreatedAt).FirstOrDefault();
            if (otp == null || otp.OTP != verifyOTPVM.OTP)
            {
                return BadRequest(new ApiResponse<object>()
                {
                    IsSuccess = false,
                    Message = "invalid / Expired OTP "
                });
            }
            otp.IsValid = false;
            await _applicationUserOTP.CommitChangesAsync();
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            return Ok(new ApiResponse<object>()
            {
                IsSuccess = true,
                Message = "OTP Verfied Successfully"
            });
           
        }
        [HttpPost("ResetPassword")]
        public async Task<IActionResult> ResetPassword( Shefaa.DTOs.Request.ResetPasswordRequest resetPasswordVM)
        {

            var user = await _userManager.FindByIdAsync(resetPasswordVM.UserId);
            if (user == null)
            {
                return NotFound(new ApiResponse<object>()
                {
                    IsSuccess = false,
                    Message = "Invalid User"
                });
            }
            var result = await _userManager.ResetPasswordAsync(user, resetPasswordVM.Token, resetPasswordVM.Password);
            if (!result.Succeeded)
            {
                return BadRequest(new ApiResponse<object>()
                {
                    IsSuccess = false,
                    Message = "Error while ResetPassword ",
                    Errors = result.Errors.Select(e => e.Description)
                });
            }
            return Ok(new ApiResponse<object>()
            {
                IsSuccess = true,
                Message = "Reset Password Successfully"
            });
        }
    }
}
