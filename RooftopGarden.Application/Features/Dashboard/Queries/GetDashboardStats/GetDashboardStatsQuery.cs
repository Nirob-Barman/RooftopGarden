using MediatR;
using RooftopGarden.Application.Features.Dashboard.Dtos;

namespace RooftopGarden.Application.Features.Dashboard.Queries.GetDashboardStats;

public record GetDashboardStatsQuery : IRequest<DashboardStatsDto>;
