using RooftopGarden.Domain.Enums;

namespace RooftopGarden.Application.Features.Payments.Dtos;

public record MakePaymentRequest(int OrderId, PaymentMethod PaymentMethod);
