using MediatR;
using RooftopGarden.Application.Features.Orders.Dtos;
using RooftopGarden.Domain.Enums;

namespace RooftopGarden.Application.Features.Orders.Commands.UpdateOrderStatus;

public record UpdateOrderStatusCommand(int OrderId, OrderStatus NewStatus) : IRequest<OrderDto>;
