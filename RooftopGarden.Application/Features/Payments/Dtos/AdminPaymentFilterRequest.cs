using RooftopGarden.Domain.Enums;

namespace RooftopGarden.Application.Features.Payments.Dtos;

public record AdminPaymentFilterRequest(
    string? CustomerId,
    PaymentStatus? Status,
    int PageNumber = 1,
    int PageSize = 20);
