using MediatR;
using RooftopGarden.Application.Features.Payments.Dtos;
using RooftopGarden.Domain.Enums;

namespace RooftopGarden.Application.Features.Payments.Commands.MakePayment;

public record MakePaymentCommand(string CustomerId, int OrderId, PaymentMethod PaymentMethod) : IRequest<PaymentDto>;
