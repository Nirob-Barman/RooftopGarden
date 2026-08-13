using RooftopGarden.Domain.Entities;

namespace RooftopGarden.Application.Features.Wishlists.Dtos;

public static class WishlistItemDtoExtensions
{
    public static WishlistItemDto ToDto(this Wishlist wishlist, Product product) => new(
        wishlist.Id,
        wishlist.ProductId,
        product.Name,
        product.ImageUrl,
        product.Price,
        wishlist.CreatedAt);
}
