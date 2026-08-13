using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RooftopGarden.Api.Extensions;
using RooftopGarden.Application.Features.Carts.Commands.AddCartItem;
using RooftopGarden.Application.Features.Carts.Commands.RemoveCartItem;
using RooftopGarden.Application.Features.Carts.Commands.UpdateCartItem;
using RooftopGarden.Application.Features.Carts.Dtos;
using RooftopGarden.Application.Features.Carts.Queries.GetCart;
using RooftopGarden.Domain.Constants;

namespace RooftopGarden.Api.Controllers;

[ApiController]
[Route("api/cart")]
[Authorize(Roles = Roles.Customer)]
public class CartController : ControllerBase
{
    private readonly ISender _sender;

    public CartController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    public async Task<ActionResult<CartDto>> GetCart(CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetCartQuery(User.GetUserId()), cancellationToken);
        return Ok(result);
    }

    [HttpPost("items")]
    public async Task<ActionResult<CartDto>> AddItem([FromBody] AddCartItemRequest request, CancellationToken cancellationToken)
    {
        var command = new AddCartItemCommand(User.GetUserId(), request.ProductId, request.Quantity);
        var result = await _sender.Send(command, cancellationToken);
        return Ok(result);
    }

    [HttpPut("items/{cartItemId:int}")]
    public async Task<ActionResult<CartDto>> UpdateItem(
        int cartItemId,
        [FromBody] UpdateCartItemRequest request,
        CancellationToken cancellationToken)
    {
        var command = new UpdateCartItemCommand(User.GetUserId(), cartItemId, request.Quantity);
        var result = await _sender.Send(command, cancellationToken);
        return Ok(result);
    }

    [HttpDelete("items/{cartItemId:int}")]
    public async Task<ActionResult<CartDto>> RemoveItem(int cartItemId, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new RemoveCartItemCommand(User.GetUserId(), cartItemId), cancellationToken);
        return Ok(result);
    }
}
