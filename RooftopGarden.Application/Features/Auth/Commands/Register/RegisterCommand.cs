using MediatR;
using RooftopGarden.Application.Features.Auth.Dtos;

namespace RooftopGarden.Application.Features.Auth.Commands.Register;

public record RegisterCommand(string Email, string Password, string FullName, string? PhoneNumber) : IRequest<AuthResponseDto>;
