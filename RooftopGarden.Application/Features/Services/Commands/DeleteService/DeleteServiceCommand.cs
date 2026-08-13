using MediatR;

namespace RooftopGarden.Application.Features.Services.Commands.DeleteService;

public record DeleteServiceCommand(int Id) : IRequest<Unit>;
