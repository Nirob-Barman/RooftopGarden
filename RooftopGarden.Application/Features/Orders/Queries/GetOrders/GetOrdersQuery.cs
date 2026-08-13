using MediatR;
using RooftopGarden.Application.Common.Models;
using RooftopGarden.Application.Features.Orders.Dtos;

namespace RooftopGarden.Application.Features.Orders.Queries.GetOrders;

public record GetOrdersQuery(string CustomerId, int PageNumber, int PageSize) : IRequest<PagedResult<OrderSummaryDto>>;
