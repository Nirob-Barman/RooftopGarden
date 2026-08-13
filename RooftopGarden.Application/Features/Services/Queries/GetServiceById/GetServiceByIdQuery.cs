using MediatR;
using RooftopGarden.Application.Features.Services.Dtos;

namespace RooftopGarden.Application.Features.Services.Queries.GetServiceById;

public record GetServiceByIdQuery(int Id, bool IncludeInactive) : IRequest<ServiceDto>;
