namespace RooftopGarden.Application.Features.Wishlists.Dtos;

public record WishlistItemDto(int Id, int ProductId, string ProductName, string? ProductImageUrl, decimal ProductPrice, DateTime CreatedAt);
