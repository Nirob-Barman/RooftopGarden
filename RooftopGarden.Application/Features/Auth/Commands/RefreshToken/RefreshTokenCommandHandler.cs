using MediatR;
using RooftopGarden.Application.Common.Interfaces;
using RooftopGarden.Application.Features.Auth.Dtos;

namespace RooftopGarden.Application.Features.Auth.Commands.RefreshToken;

public class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, AuthResponseDto>
{
    private readonly IRefreshTokenService _refreshTokenService;
    private readonly IIdentityService _identityService;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    public RefreshTokenCommandHandler(
        IRefreshTokenService refreshTokenService,
        IIdentityService identityService,
        IJwtTokenGenerator jwtTokenGenerator)
    {
        _refreshTokenService = refreshTokenService;
        _identityService = identityService;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    public async Task<AuthResponseDto> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        var rotated = await _refreshTokenService.RotateAsync(request.RefreshToken, cancellationToken);
        if (!rotated.Succeeded)
        {
            throw new UnauthorizedAccessException("Invalid or expired refresh token.");
        }

        var profile = await _identityService.GetProfileAsync(rotated.UserId!)
            ?? throw new UnauthorizedAccessException("Invalid or expired refresh token.");

        var accessToken = _jwtTokenGenerator.GenerateToken(profile.UserId, profile.Email, profile.FullName, profile.Role);

        return new AuthResponseDto(
            accessToken.Token,
            accessToken.ExpiresAt,
            rotated.NewRawToken!,
            rotated.NewExpiresAt!.Value,
            profile.Email,
            profile.FullName,
            profile.Role);
    }
}
