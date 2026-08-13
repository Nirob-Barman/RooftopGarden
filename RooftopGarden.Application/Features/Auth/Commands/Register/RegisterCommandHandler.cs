using MediatR;
using RooftopGarden.Application.Common.Exceptions;
using RooftopGarden.Application.Common.Interfaces;
using RooftopGarden.Application.Features.Auth.Dtos;
using RooftopGarden.Domain.Constants;

namespace RooftopGarden.Application.Features.Auth.Commands.Register;

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, AuthResponseDto>
{
    private readonly IIdentityService _identityService;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly IRefreshTokenService _refreshTokenService;

    public RegisterCommandHandler(
        IIdentityService identityService,
        IJwtTokenGenerator jwtTokenGenerator,
        IRefreshTokenService refreshTokenService)
    {
        _identityService = identityService;
        _jwtTokenGenerator = jwtTokenGenerator;
        _refreshTokenService = refreshTokenService;
    }

    public async Task<AuthResponseDto> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        var result = await _identityService.CreateCustomerAsync(
            request.Email,
            request.Password,
            request.FullName,
            request.PhoneNumber);

        if (!result.Succeeded)
        {
            throw new IdentityException(result.Errors);
        }

        var accessToken = _jwtTokenGenerator.GenerateToken(result.UserId!, request.Email, request.FullName, Roles.Customer);
        var refreshToken = await _refreshTokenService.IssueAsync(result.UserId!, cancellationToken);

        return new AuthResponseDto(
            accessToken.Token,
            accessToken.ExpiresAt,
            refreshToken.RawToken,
            refreshToken.ExpiresAt,
            request.Email,
            request.FullName,
            Roles.Customer);
    }
}
