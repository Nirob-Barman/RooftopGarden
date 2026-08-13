using MediatR;
using RooftopGarden.Application.Common.Interfaces;
using RooftopGarden.Application.Features.Auth.Dtos;

namespace RooftopGarden.Application.Features.Auth.Commands.Login;

public class LoginCommandHandler : IRequestHandler<LoginCommand, AuthResponseDto>
{
    private readonly IIdentityService _identityService;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly IRefreshTokenService _refreshTokenService;

    public LoginCommandHandler(
        IIdentityService identityService,
        IJwtTokenGenerator jwtTokenGenerator,
        IRefreshTokenService refreshTokenService)
    {
        _identityService = identityService;
        _jwtTokenGenerator = jwtTokenGenerator;
        _refreshTokenService = refreshTokenService;
    }

    public async Task<AuthResponseDto> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var user = await _identityService.ValidateCredentialsAsync(request.Email, request.Password)
            ?? throw new UnauthorizedAccessException("Invalid email or password.");

        var accessToken = _jwtTokenGenerator.GenerateToken(user.UserId, user.Email, user.FullName, user.Role);
        var refreshToken = await _refreshTokenService.IssueAsync(user.UserId, cancellationToken);

        return new AuthResponseDto(
            accessToken.Token,
            accessToken.ExpiresAt,
            refreshToken.RawToken,
            user.Email,
            user.FullName,
            user.Role);
    }
}
