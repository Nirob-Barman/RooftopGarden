using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RooftopGarden.Application.Features.Dashboard.Dtos;
using RooftopGarden.Application.Features.Dashboard.Queries.GetDashboardStats;
using RooftopGarden.Domain.Constants;

namespace RooftopGarden.Api.Controllers;

[ApiController]
[Route("api/admin/dashboard")]
[Authorize(Roles = Roles.Admin)]
public class AdminDashboardController : ControllerBase
{
    private readonly ISender _sender;

    public AdminDashboardController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    public async Task<ActionResult<DashboardStatsDto>> GetStats(CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetDashboardStatsQuery(), cancellationToken);
        return Ok(result);
    }
}
