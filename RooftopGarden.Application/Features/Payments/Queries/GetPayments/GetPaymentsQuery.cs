using MediatR;
using RooftopGarden.Application.Common.Models;
using RooftopGarden.Application.Features.Payments.Dtos;

namespace RooftopGarden.Application.Features.Payments.Queries.GetPayments;

public record GetPaymentsQuery(string CustomerId, int PageNumber, int PageSize) : IRequest<PagedResult<PaymentDto>>;
