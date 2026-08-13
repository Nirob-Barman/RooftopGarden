using RooftopGarden.Domain.Enums;

namespace RooftopGarden.Application.Features.Orders.Dtos;

public record AdminOrderFilterRequest(
    string? CustomerId,
    OrderStatus? Status,
    int PageNumber = 1,
    int PageSize = 20);
