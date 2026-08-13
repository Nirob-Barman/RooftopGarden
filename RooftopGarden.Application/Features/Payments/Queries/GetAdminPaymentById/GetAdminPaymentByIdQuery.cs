using MediatR;
using RooftopGarden.Application.Features.Payments.Dtos;

namespace RooftopGarden.Application.Features.Payments.Queries.GetAdminPaymentById;

public record GetAdminPaymentByIdQuery(int PaymentId) : IRequest<PaymentDto>;
