using RooftopGarden.Domain.Enums;

namespace RooftopGarden.Application.Features.Orders.Dtos;

public record UpdateOrderStatusRequest(OrderStatus NewStatus);
