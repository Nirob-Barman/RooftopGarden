using MediatR;
using RooftopGarden.Application.Common.Models;
using RooftopGarden.Application.Features.Orders.Dtos;
using RooftopGarden.Domain.Enums;

namespace RooftopGarden.Application.Features.Orders.Queries.GetAdminOrders;

public record GetAdminOrdersQuery(
    string? CustomerId,
    OrderStatus? Status,
    int PageNumber,
    int PageSize) : IRequest<PagedResult<OrderSummaryDto>>;
