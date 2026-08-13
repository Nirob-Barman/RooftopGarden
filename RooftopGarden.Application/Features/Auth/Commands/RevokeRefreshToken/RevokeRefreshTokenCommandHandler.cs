using MediatR;
using RooftopGarden.Application.Common.Interfaces;

namespace RooftopGarden.Application.Features.Auth.Commands.RevokeRefreshToken;

public class RevokeRefreshTokenCommandHandler : IRequestHandler<RevokeRefreshTokenCommand, Unit>
{
    private readonly IRefreshTokenService _refreshTokenService;

    public RevokeRefreshTokenCommandHandler(IRefreshTokenService refreshTokenService)
    {
        _refreshTokenService = refreshTokenService;
    }

    public async Task<Unit> Handle(RevokeRefreshTokenCommand request, CancellationToken cancellationToken)
    {
        await _refreshTokenService.RevokeAsync(request.RefreshToken, cancellationToken);
        return Unit.Value;
    }
}
