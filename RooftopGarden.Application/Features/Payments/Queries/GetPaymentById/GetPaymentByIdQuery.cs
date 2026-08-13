using MediatR;
using RooftopGarden.Application.Features.Payments.Dtos;

namespace RooftopGarden.Application.Features.Payments.Queries.GetPaymentById;

public record GetPaymentByIdQuery(string CustomerId, int PaymentId) : IRequest<PaymentDto>;
