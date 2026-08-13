using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RooftopGarden.Api.Extensions;
using RooftopGarden.Application.Common.Models;
using RooftopGarden.Application.Features.Wishlists.Commands.AddWishlistItem;
using RooftopGarden.Application.Features.Wishlists.Commands.RemoveWishlistItem;
using RooftopGarden.Application.Features.Wishlists.Dtos;
using RooftopGarden.Application.Features.Wishlists.Queries.GetWishlist;
using RooftopGarden.Domain.Constants;

namespace RooftopGarden.Api.Controllers;

[ApiController]
[Route("api/wishlist")]
[Authorize(Roles = Roles.Customer)]
public class WishlistController : ControllerBase
{
    private readonly ISender _sender;

    public WishlistController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<WishlistItemDto>>> GetWishlist(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var result = await _sender.Send(new GetWishlistQuery(User.GetUserId(), pageNumber, pageSize), cancellationToken);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<WishlistItemDto>> AddItem([FromBody] AddWishlistItemRequest request, CancellationToken cancellationToken)
    {
        var command = new AddWishlistItemCommand(User.GetUserId(), request.ProductId);
        var result = await _sender.Send(command, cancellationToken);
        return Ok(result);
    }

    [HttpDelete("{productId:int}")]
    public async Task<IActionResult> RemoveItem(int productId, CancellationToken cancellationToken)
    {
        await _sender.Send(new RemoveWishlistItemCommand(User.GetUserId(), productId), cancellationToken);
        return NoContent();
    }
}
