using MediatR;
using RooftopGarden.Application.Features.Orders.Dtos;

namespace RooftopGarden.Application.Features.Orders.Commands.PlaceOrder;

public record PlaceOrderCommand(string CustomerId, string ShippingAddress) : IRequest<OrderDto>;
