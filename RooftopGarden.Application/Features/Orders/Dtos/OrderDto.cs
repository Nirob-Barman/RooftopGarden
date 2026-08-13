namespace RooftopGarden.Application.Features.Orders.Dtos;

public record OrderDto(
    int Id,
    DateTime OrderDate,
    decimal TotalAmount,
    string ShippingAddress,
    string PaymentStatus,
    string OrderStatus,
    List<OrderItemDto> Items);
