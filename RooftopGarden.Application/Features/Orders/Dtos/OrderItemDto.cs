namespace RooftopGarden.Application.Features.Orders.Dtos;

public record OrderItemDto(int Id, int ProductId, string ProductName, int Quantity, decimal UnitPrice, decimal SubTotal);
