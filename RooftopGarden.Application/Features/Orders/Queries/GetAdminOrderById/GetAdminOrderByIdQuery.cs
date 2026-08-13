using MediatR;
using RooftopGarden.Application.Features.Orders.Dtos;

namespace RooftopGarden.Application.Features.Orders.Queries.GetAdminOrderById;

public record GetAdminOrderByIdQuery(int OrderId) : IRequest<OrderDto>;
