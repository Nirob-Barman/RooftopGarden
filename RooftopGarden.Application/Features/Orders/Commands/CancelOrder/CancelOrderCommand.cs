using MediatR;
using RooftopGarden.Application.Features.Orders.Dtos;

namespace RooftopGarden.Application.Features.Orders.Commands.CancelOrder;

public record CancelOrderCommand(string CustomerId, int OrderId) : IRequest<OrderDto>;
