using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RooftopGarden.Api.Extensions;
using RooftopGarden.Application.Common.Models;
using RooftopGarden.Application.Features.Orders.Commands.CancelOrder;
using RooftopGarden.Application.Features.Orders.Commands.PlaceOrder;
using RooftopGarden.Application.Features.Orders.Dtos;
using RooftopGarden.Application.Features.Orders.Queries.GetOrderById;
using RooftopGarden.Application.Features.Orders.Queries.GetOrders;
using RooftopGarden.Domain.Constants;

namespace RooftopGarden.Api.Controllers;

[ApiController]
[Route("api/orders")]
[Authorize(Roles = Roles.Customer)]
public class OrdersController : ControllerBase
{
    private readonly ISender _sender;

    public OrdersController(ISender sender)
    {
        _sender = sender;
    }

    [HttpPost]
    public async Task<ActionResult<OrderDto>> PlaceOrder([FromBody] PlaceOrderRequest request, CancellationToken cancellationToken)
    {
        var command = new PlaceOrderCommand(User.GetUserId(), request.ShippingAddress);
        var result = await _sender.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetOrderById), new { id = result.Id }, result);
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<OrderSummaryDto>>> GetOrders(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var result = await _sender.Send(new GetOrdersQuery(User.GetUserId(), pageNumber, pageSize), cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<OrderDto>> GetOrderById(int id, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetOrderByIdQuery(User.GetUserId(), id), cancellationToken);
        return Ok(result);
    }

    [HttpPost("{id:int}/cancel")]
    public async Task<ActionResult<OrderDto>> CancelOrder(int id, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new CancelOrderCommand(User.GetUserId(), id), cancellationToken);
        return Ok(result);
    }
}
