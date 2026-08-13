using MediatR;
using RooftopGarden.Application.Features.Payments.Dtos;

namespace RooftopGarden.Application.Features.Payments.Commands.RefundPayment;

public record RefundPaymentCommand(int PaymentId) : IRequest<PaymentDto>;
