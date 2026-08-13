namespace RooftopGarden.Application.Features.Payments.Dtos;

public record PaymentDto(
    int Id,
    int OrderId,
    decimal Amount,
    string PaymentMethod,
    string? TransactionId,
    string PaymentStatus,
    DateTime? PaidAt);
