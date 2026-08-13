using MediatR;
using RooftopGarden.Application.Features.Services.Dtos;

namespace RooftopGarden.Application.Features.Services.Commands.CreateService;

public record CreateServiceCommand(string Name, string? Description, decimal Price, TimeSpan Duration, string? ImageUrl) : IRequest<ServiceDto>;
