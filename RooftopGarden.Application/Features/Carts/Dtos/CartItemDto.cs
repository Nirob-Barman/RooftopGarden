namespace RooftopGarden.Application.Features.Carts.Dtos;

public record CartItemDto(
    int Id,
    int ProductId,
    string ProductName,
    string? ProductImageUrl,
    decimal UnitPrice,
    int Quantity,
    decimal SubTotal);
