using MediatR;
using RooftopGarden.Application.Features.Auth.Dtos;

namespace RooftopGarden.Application.Features.Auth.Commands.RefreshToken;

public record RefreshTokenCommand(string RefreshToken) : IRequest<AuthResponseDto>;
