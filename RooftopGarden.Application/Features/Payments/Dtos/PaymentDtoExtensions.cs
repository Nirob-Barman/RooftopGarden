using RooftopGarden.Domain.Entities;

namespace RooftopGarden.Application.Features.Payments.Dtos;

public static class PaymentDtoExtensions
{
    public static PaymentDto ToDto(this Payment payment) => new(
        payment.Id,
        payment.OrderId,
        payment.Amount,
        payment.PaymentMethod.ToString(),
        payment.TransactionId,
        payment.PaymentStatus.ToString(),
        payment.PaidAt);
}
