namespace RooftopGarden.Application.Features.Orders.Dtos;

public record OrderSummaryDto(
    int Id,
    DateTime OrderDate,
    decimal TotalAmount,
    string OrderStatus,
    string PaymentStatus,
    int ItemCount);
