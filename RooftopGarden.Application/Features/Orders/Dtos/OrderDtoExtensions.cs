using RooftopGarden.Domain.Entities;

namespace RooftopGarden.Application.Features.Orders.Dtos;

public static class OrderDtoExtensions
{
    public static OrderDto ToDto(this Order order) => new(
        order.Id,
        order.OrderDate,
        order.TotalAmount,
        order.ShippingAddress,
        order.PaymentStatus.ToString(),
        order.OrderStatus.ToString(),
        order.OrderItems
            .Select(oi => new OrderItemDto(oi.Id, oi.ProductId, oi.Product.Name, oi.Quantity, oi.UnitPrice, oi.SubTotal))
            .ToList());

    public static OrderSummaryDto ToSummaryDto(this Order order) => new(
        order.Id,
        order.OrderDate,
        order.TotalAmount,
        order.OrderStatus.ToString(),
        order.PaymentStatus.ToString(),
        order.OrderItems.Count);
}
