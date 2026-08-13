using RooftopGarden.Application.Common.Models.Identity;

namespace RooftopGarden.Application.Common.Interfaces;

public interface IRefreshTokenService
{
    Task<IssuedRefreshToken> IssueAsync(string userId, CancellationToken cancellationToken);

    Task<RefreshTokenResult> RotateAsync(string rawToken, CancellationToken cancellationToken);

    Task<bool> RevokeAsync(string rawToken, CancellationToken cancellationToken);
}
