using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RooftopGarden.Application.Common.Models;
using RooftopGarden.Application.Features.Orders.Commands.UpdateOrderStatus;
using RooftopGarden.Application.Features.Orders.Dtos;
using RooftopGarden.Application.Features.Orders.Queries.GetAdminOrderById;
using RooftopGarden.Application.Features.Orders.Queries.GetAdminOrders;
using RooftopGarden.Domain.Constants;

namespace RooftopGarden.Api.Controllers;

[ApiController]
[Route("api/admin/orders")]
[Authorize(Roles = Roles.Admin)]
public class AdminOrdersController : ControllerBase
{
    private readonly ISender _sender;

    public AdminOrdersController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<OrderSummaryDto>>> GetOrders(
        [FromQuery] AdminOrderFilterRequest filter,
        CancellationToken cancellationToken)
    {
        var query = new GetAdminOrdersQuery(filter.CustomerId, filter.Status, filter.PageNumber, filter.PageSize);
        var result = await _sender.Send(query, cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<OrderDto>> GetOrderById(int id, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetAdminOrderByIdQuery(id), cancellationToken);
        return Ok(result);
    }

    [HttpPut("{id:int}/status")]
    public async Task<ActionResult<OrderDto>> UpdateStatus(
        int id,
        [FromBody] UpdateOrderStatusRequest request,
        CancellationToken cancellationToken)
    {
        var command = new UpdateOrderStatusCommand(id, request.NewStatus);
        var result = await _sender.Send(command, cancellationToken);
        return Ok(result);
    }
}
