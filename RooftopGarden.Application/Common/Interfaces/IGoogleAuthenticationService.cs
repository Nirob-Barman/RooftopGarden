using RooftopGarden.Application.Common.Models.GoogleLogin;

namespace RooftopGarden.Application.Common.Interfaces;
public interface IGoogleAuthenticationService
{
    Task<GoogleUserInfo> ValidateTokenAsync(string credential, CancellationToken cancellationToken = default);
}
