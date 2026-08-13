using MediatR;
using RooftopGarden.Application.Common.Models;
using RooftopGarden.Application.Features.Services.Dtos;

namespace RooftopGarden.Application.Features.Services.Queries.GetServices;

public record GetServicesQuery(bool IncludeInactive, int PageNumber, int PageSize) : IRequest<PagedResult<ServiceDto>>;
