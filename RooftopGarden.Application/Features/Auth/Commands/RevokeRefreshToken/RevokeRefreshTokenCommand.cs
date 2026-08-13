using MediatR;

namespace RooftopGarden.Application.Features.Auth.Commands.RevokeRefreshToken;

public record RevokeRefreshTokenCommand(string RefreshToken) : IRequest<Unit>;
