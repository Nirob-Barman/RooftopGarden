using MediatR;
using RooftopGarden.Application.Features.Services.Dtos;

namespace RooftopGarden.Application.Features.Services.Commands.UpdateService;

public record UpdateServiceCommand(int Id, string Name, string? Description, decimal Price, TimeSpan Duration, string? ImageUrl) : IRequest<ServiceDto>;
