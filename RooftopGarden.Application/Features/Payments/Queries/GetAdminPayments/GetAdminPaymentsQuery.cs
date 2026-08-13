using MediatR;
using RooftopGarden.Application.Common.Models;
using RooftopGarden.Application.Features.Payments.Dtos;
using RooftopGarden.Domain.Enums;

namespace RooftopGarden.Application.Features.Payments.Queries.GetAdminPayments;

public record GetAdminPaymentsQuery(
    string? CustomerId,
    PaymentStatus? Status,
    int PageNumber,
    int PageSize) : IRequest<PagedResult<PaymentDto>>;
