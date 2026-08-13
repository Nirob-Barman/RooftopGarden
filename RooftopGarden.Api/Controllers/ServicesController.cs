using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RooftopGarden.Application.Common.Models;
using RooftopGarden.Application.Features.Services.Commands.CreateService;
using RooftopGarden.Application.Features.Services.Commands.DeleteService;
using RooftopGarden.Application.Features.Services.Commands.UpdateService;
using RooftopGarden.Application.Features.Services.Dtos;
using RooftopGarden.Application.Features.Services.Queries.GetServiceById;
using RooftopGarden.Application.Features.Services.Queries.GetServices;
using RooftopGarden.Domain.Constants;

namespace RooftopGarden.Api.Controllers;

[ApiController]
[Route("api/services")]
public class ServicesController : ControllerBase
{
    private readonly ISender _sender;

    public ServicesController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<PagedResult<ServiceDto>>> GetServices(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var includeInactive = User.IsInRole(Roles.Admin);
        var result = await _sender.Send(new GetServicesQuery(includeInactive, pageNumber, pageSize), cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<ActionResult<ServiceDto>> GetServiceById(int id, CancellationToken cancellationToken)
    {
        var includeInactive = User.IsInRole(Roles.Admin);
        var result = await _sender.Send(new GetServiceByIdQuery(id, includeInactive), cancellationToken);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = Roles.Admin)]
    public async Task<ActionResult<ServiceDto>> CreateService([FromBody] CreateServiceCommand command, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetServiceById), new { id = result.Id }, result);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<ActionResult<ServiceDto>> UpdateService(
        int id,
        [FromBody] UpdateServiceRequest request,
        CancellationToken cancellationToken)
    {
        var command = new UpdateServiceCommand(id, request.Name, request.Description, request.Price, request.Duration, request.ImageUrl);
        var result = await _sender.Send(command, cancellationToken);
        return Ok(result);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> DeleteService(int id, CancellationToken cancellationToken)
    {
        await _sender.Send(new DeleteServiceCommand(id), cancellationToken);
        return NoContent();
    }
}
