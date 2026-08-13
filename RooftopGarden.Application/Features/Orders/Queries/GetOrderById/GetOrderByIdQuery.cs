using MediatR;
using RooftopGarden.Application.Features.Orders.Dtos;

namespace RooftopGarden.Application.Features.Orders.Queries.GetOrderById;

public record GetOrderByIdQuery(string CustomerId, int OrderId) : IRequest<OrderDto>;
