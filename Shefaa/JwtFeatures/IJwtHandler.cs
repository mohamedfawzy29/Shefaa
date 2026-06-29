namespace Shefaa.JwtFeatures
{
    public interface IJwtHandler
    {
        Task<string> GenerateAccessTokenAsync(ApplicationUser user);
    }
}
