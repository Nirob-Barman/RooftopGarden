using RooftopGarden.Domain.Entities;

namespace RooftopGarden.Application.Features.Carts.Dtos;

public static class CartDtoExtensions
{
    public static CartDto ToDto(this Cart cart)
    {
        var items = cart.CartItems
            .Select(ci => new CartItemDto(
                ci.Id,
                ci.ProductId,
                ci.Product.Name,
                ci.Product.ImageUrl,
                ci.Product.Price,
                ci.Quantity,
                ci.Quantity * ci.Product.Price))
            .ToList();

        return new CartDto(cart.Id, items, items.Sum(i => i.SubTotal));
    }
}
