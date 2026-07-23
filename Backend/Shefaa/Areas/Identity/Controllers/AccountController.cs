
using Shefaa.Services;
using System.Security.Cryptography;

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
        IApplicationUserService _applicationUserService;
        IRepository<Models.Patient> _patientRepository;
        IRepository<Doctor> _doctorRepository;
        IRepository<Specialization> _specializationRepository;
        IRepository<Receptionist> _receptionistRepository;
        IRepository<Branch> _branchRepository;
        IRepository<UserPhoneNumber> _userPhoneNumberRepository;

        public AccountController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IEmailSender emailSender, IRepository<ApplicationUserOTP> applicationUserOTP, IJwtHandler jwtHandler, IFileService fileService, IApplicationUserService identityService, IRepository<Models.Patient> patientRepository, IRepository<Doctor> doctorRepository, IRepository<Specialization> specializationRepository, IRepository<Branch> branchRepository, IRepository<Receptionist> receptionistRepository, IRepository<UserPhoneNumber> userPhoneNumberRepository)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _emailSender = emailSender;
            _applicationUserOTP = applicationUserOTP;
            _jwtHandler = jwtHandler;
            _fileService = fileService;
            _applicationUserService = identityService;
            _patientRepository = patientRepository;
            _doctorRepository = doctorRepository;
            _specializationRepository = specializationRepository;
            _branchRepository = branchRepository;
            _receptionistRepository = receptionistRepository;
            _userPhoneNumberRepository = userPhoneNumberRepository;
        }

        [HttpPost("RegisterPatient")]
        public async Task<IActionResult> RegisterPatient([FromForm] RegisterPatientRequest request)
        {
            string profileImage = "default.png";
            var user = (ApplicationUser?)null;
            try
            {
                profileImage = await _fileService.UploadProfileImageAsync(request.ProfileImg);

                user = _applicationUserService.CreateApplicationUser(request.FirstName, request.LastName, request.Email, request.UserName, request.Gender, request.DateOfBirth, profileImage);

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

                await _applicationUserService.AddUserPhoneNumbersAsync(user.Id, request.PhoneNumbers);

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

                var patient = new Models.Patient
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
                if (user != null)
                {
                    await _userManager.DeleteAsync(user);
                }

                await _fileService.DeleteProfileImageAsync(profileImage);

                return StatusCode(StatusCodes.Status500InternalServerError,
                    new ApiResponse<object>
                    {
                        IsSuccess = false,
                        Message = ex.Message
                    });
            }
        }

        [HttpPost("RegisterDoctor")]
        public async Task<IActionResult> RegisterDoctor([FromForm] RegisterDoctorRequest request)
        {
            string profileImage = "default.png";
            var user = (ApplicationUser?)null;
            try
            {
                profileImage = await _fileService.UploadProfileImageAsync(request.ProfileImg);
                user = _applicationUserService.CreateApplicationUser(request.FirstName, request.LastName, request.Email, request.UserName, request.Gender, request.DateOfBirth, profileImage);

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

                await _applicationUserService.AddUserPhoneNumbersAsync(user.Id, request.PhoneNumbers);

                var addRoleResult = await _userManager.AddToRoleAsync(user, CD.DOCTOR_ROLE);
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

                if (await _doctorRepository.ExistsAsync(d => d.LicenseNumber == request.LicenseNumber))
                {
                    await _userManager.DeleteAsync(user);
                    await _fileService.DeleteProfileImageAsync(profileImage);

                    return BadRequest(new ApiResponse<object>
                    {
                        IsSuccess = false,
                        Message = "License number already exists."
                    });
                }

                var specialization = await _specializationRepository.GetOneAsynch(s => s.Id == request.SpecializationId);
                if (specialization == null)
                {
                    await _userManager.DeleteAsync(user);
                    await _fileService.DeleteProfileImageAsync(profileImage);

                    return BadRequest(new ApiResponse<object>
                    {
                        IsSuccess = false,
                        Message = "Specialization not found."
                    });
                }

                var doctor = new Doctor
                {
                    UserId = user.Id,
                    Bio = request.Bio,
                    YearsOfExperience = request.YearsOfExperience,
                    LicenseNumber = request.LicenseNumber,
                    SpecializationId = request.SpecializationId,
                    AverageRating = 0,
                    Status = DoctorStatus.Pending
                };

                try
                {
                    await _doctorRepository.AddAsync(doctor);
                    await _doctorRepository.CommitChangesAsync();
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
                    Message = "Doctor registration completed successfully. Please check your email to confirm your account."
                });
            }
            catch (Exception ex)
            {
                if (user != null)
                {
                    await _userManager.DeleteAsync(user);
                }

                await _fileService.DeleteProfileImageAsync(profileImage);

                return StatusCode(StatusCodes.Status500InternalServerError,
                    new ApiResponse<object>
                    {
                        IsSuccess = false,
                        Message = ex.Message
                    });
            }
        }

        [HttpPost("RegisterReceptionist")]
        public async Task<IActionResult> RegisterReceptionist([FromForm] RegisterReceptionistRequest request)
        {
            string profileImage = "default.png";
            var user = (ApplicationUser?)null;
            try
            {
                profileImage = await _fileService.UploadProfileImageAsync(request.ProfileImg);
                user = _applicationUserService.CreateApplicationUser(request.FirstName, request.LastName, request.Email, request.UserName, request.Gender, request.DateOfBirth, profileImage);

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

                await _applicationUserService.AddUserPhoneNumbersAsync(user.Id, request.PhoneNumbers);

                var addRoleResult = await _userManager.AddToRoleAsync(user, CD.RECEPTIONIST_ROLE);
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

                var branch = await _branchRepository.GetOneAsynch(b => b.Id == request.BranchId);
                if (branch == null)
                {
                    await _userManager.DeleteAsync(user);
                    await _fileService.DeleteProfileImageAsync(profileImage);

                    return BadRequest(new ApiResponse<object>
                    {
                        IsSuccess = false,
                        Message = "Branch not found."
                    });
                }

                var receptionist = new Receptionist
                {
                    UserId = user.Id,
                    BranchId = request.BranchId,
                    Status = ReceptionistStatus.Pending
                };

                try
                {
                    await _receptionistRepository.AddAsync(receptionist);
                    await _receptionistRepository.CommitChangesAsync();
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
                    Message = "Receptionist registration completed successfully. Please check your email to confirm your account."
                });
            }
            catch (Exception ex)
            {
                if (user != null)
                {
                    await _userManager.DeleteAsync(user);
                }

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
        public async Task<IActionResult> Login(LoginRequest loginRequest)
        {
            var user = await _userManager.FindByEmailAsync(loginRequest.UserNameOrEmail)
                       ?? await _userManager.FindByNameAsync(loginRequest.UserNameOrEmail);

            if (user == null)
            {
                return Unauthorized(new ApiResponse<object>()
                {
                    IsSuccess = false,
                    Message = "Invalid username/email or password."
                });
            }

            if (!user.IsActive)
            {
                return Unauthorized(new ApiResponse<object>()
                {
                    IsSuccess = false,
                    Message = "Your account has been deactivated."
                });
            }

            var result = await _signInManager.PasswordSignInAsync(user,loginRequest.Password,loginRequest.RememberMe,lockoutOnFailure: true);

            if (!result.Succeeded)
            {
                List<string> errors = new();

                if (result.IsLockedOut)
                {
                    errors.Add("Too many attempts. Try again later.");
                }
                else if (result.IsNotAllowed)
                {
                    errors.Add("Please confirm your email first.");
                }
                else
                {
                    errors.Add("Invalid username/email or password.");
                }

                return BadRequest(new ApiResponse<object>()
                {
                    IsSuccess = false,
                    Message = "Login failed.",
                    Errors = errors
                });
            }

            if (await _userManager.IsInRoleAsync(user, CD.DOCTOR_ROLE))
            {
                var doctor = await _doctorRepository.GetOneAsynch(
                    d => d.UserId == user.Id);

                if (doctor == null)
                {
                    return Unauthorized(new ApiResponse<object>()
                    {
                        IsSuccess = false,
                        Message = "Doctor profile not found."
                    });
                }

                if (doctor.Status != DoctorStatus.Approved)
                {
                    return Unauthorized(new ApiResponse<object>()
                    {
                        IsSuccess = false,
                        Message = $"Your doctor account is {doctor.Status}."
                    });
                }
            }

            var token = await _jwtHandler.GenerateAccessTokenAsync(user);

            var roles = await _userManager.GetRolesAsync(user);

            return Ok(new AuthenticatedResponse()
            {
                AccessToken = token,
                UserName = user.UserName!,
                Email = user.Email!,
                FullName = $"{user.FirstName} {user.LastName}",
                Role = roles.FirstOrDefault() ?? string.Empty
            });
        }


        [HttpPost("ResendEmailConfirmation")]
        public async Task<IActionResult> ResendEmailConfirmation(ResendEmailConfirmationRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.UserNameOrEmail)?? await _userManager.FindByNameAsync(request.UserNameOrEmail);
            if (user == null)
            {
                return Unauthorized(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Invalid username or email."
                });
            }
            if (string.IsNullOrWhiteSpace(user.Email))
            {
                return BadRequest(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "User does not have an email address."
                });
            }
            if (user.EmailConfirmed)
            {
                return BadRequest(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Your email has already been confirmed."
                });
            }

            try
            {
                var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);

                var confirmationLink = Url.Action(
                    nameof(ConfirmEmail),
                    "Account",
                    new
                    {
                        area = "Identity",
                        UserId = user.Id,
                        Token = token
                    },
                    Request.Scheme);

                await _emailSender.SendEmailAsync(
                    user.Email,
                    "Confirm your email - Shefaa",
                    $"""
                            <h2>Welcome to Shefaa</h2>

                            <p>Please click the button below to confirm your email address.</p>

                            <p>
                                <a href="{confirmationLink}">
                                    Confirm Email
                                </a>
                            </p>
                     """);

                return Ok(new ApiResponse<object>
                {
                    IsSuccess = true,
                    Message = "Confirmation email has been sent successfully."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new ApiResponse<object>
                    {
                        IsSuccess = false,
                        Message = ex.Message
                    });
            }
        }

        [HttpPost("ForgetPassword")]
        public async Task<IActionResult> ForgetPassword(ForgetPasswordRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.UserNameOrEmail) ?? await _userManager.FindByNameAsync(request.UserNameOrEmail);
            if (user == null)
            {
                return Unauthorized(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Invalid username or email."
                });
            }
            if (!user.EmailConfirmed)
            {
                return BadRequest(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Please confirm your email first."
                });
            }
            if (!user.IsActive)
            {
                return BadRequest(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Your account has been deactivated."
                });
            }
            if (await _userManager.IsInRoleAsync(user, CD.DOCTOR_ROLE))
            {
                var doctor = await _doctorRepository.GetOneAsynch(d => d.UserId == user.Id);
                if (doctor == null)
                {
                    return BadRequest(new ApiResponse<object>
                    {
                        IsSuccess = false,
                        Message = "Doctor profile not found."
                    });
                }
                if (doctor.Status != DoctorStatus.Approved)
                {
                    return BadRequest(new ApiResponse<object>
                    {
                        IsSuccess = false,
                        Message = $"Your account is {doctor.Status}."
                    });
                }
            }

            var oldOtps = await _applicationUserOTP.GetAsync(o => o.ApplicationUserId == user.Id && o.IsValid,trackChanges: true);

            foreach (var oldOtp in oldOtps)
            {
                oldOtp.IsValid = false;
            }

            await _applicationUserOTP.CommitChangesAsync();

            var otp = RandomNumberGenerator.GetInt32(100000, 1000000).ToString();

            var applicationUserOtp = new ApplicationUserOTP(otp, user.Id);

            await _applicationUserOTP.AddAsync(applicationUserOtp);
            await _applicationUserOTP.CommitChangesAsync();

            try
            {
                await _emailSender.SendEmailAsync(
                    user.Email!,
                    "Reset your password - Shefaa",
                    $"""
                        <h2>Password Reset</h2>

                        <p>Use the following OTP to reset your password:</p>

                        <h1 style="color:red;">{otp}</h1>

                        <p>This OTP is valid for 30 minutes.</p>
                     """);

                return Ok(new ApiResponse<object>
                {
                    IsSuccess = true,
                    Message = "OTP has been sent successfully."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new ApiResponse<object>
                    {
                        IsSuccess = false,
                        Message = ex.Message
                    });
            }
        }

        [HttpPost("VerifyOTP")]
        public async Task<IActionResult> VerifyOTP(VerifyOTPRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.UserNameOrEmail) ?? await _userManager.FindByNameAsync(request.UserNameOrEmail);
            if (user == null)
            {
                return Unauthorized(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Invalid username or email."
                });
            }
            var otp = (await _applicationUserOTP.GetAsync(o => o.ApplicationUserId == user.Id && o.IsValid && DateTime.UtcNow < o.ValidTo)).OrderByDescending(o => o.CreatedAt).FirstOrDefault();
            if (otp == null || otp.OTP != request.OTP)
            {
                return BadRequest(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Invalid or expired OTP."
                });
            }

            var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);

            return Ok(new ApiResponse<object>
            {
                IsSuccess = true,
                Message = "OTP verified successfully.",
                Data = new
                {
                    ResetToken = resetToken
                }
            });
        }

        [HttpPost("ResetPassword")]
        public async Task<IActionResult> ResetPassword(ResetPasswordRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.UserNameOrEmail) ?? await _userManager.FindByNameAsync(request.UserNameOrEmail);
            if (user == null)
            {
                return Unauthorized(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Invalid username or email."
                });
            }
            if (!user.EmailConfirmed)
            {
                return BadRequest(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Please confirm your email first."
                });
            }
            if (!user.IsActive)
            {
                return BadRequest(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Your account has been deactivated."
                });
            }
            var result = await _userManager.ResetPasswordAsync(user,request.ResetToken,request.NewPassword);

            if (!result.Succeeded)
            {
                return BadRequest(new ApiResponse<object>
                {
                    IsSuccess = false,
                    Message = "Password reset failed.",
                    Errors = result.Errors.Select(e => e.Description)
                });
            }

            var otp = (await _applicationUserOTP.GetAsync(o => o.ApplicationUserId == user.Id && o.IsValid)).OrderByDescending(o => o.CreatedAt).FirstOrDefault();
            if (otp != null)
            {
                otp.IsValid = false;
                await _applicationUserOTP.CommitChangesAsync();
            }

            return Ok(new ApiResponse<object>
            {
                IsSuccess = true,
                Message = "Password reset successfully."
            });
        }
    }
}
