using MediatR;
using RooftopGarden.Application.Features.Auth.Dtos;

namespace RooftopGarden.Application.Features.Auth.Commands.GoogleLogin;

public record GoogleLoginCommand(string Credential) : IRequest<AuthResponseDto>;