using RooftopGarden.Domain.Common;
using RooftopGarden.Domain.Enums;

namespace RooftopGarden.Domain.Entities;

public class Payment : BaseEntity
{
    public int OrderId { get; private set; }
    public Order Order { get; private set; } = null!;

    public string CustomerId { get; private set; } = string.Empty;
    public decimal Amount { get; private set; }
    public PaymentMethod PaymentMethod { get; private set; }
    public string? TransactionId { get; private set; }
    public PaymentStatus PaymentStatus { get; private set; }
    public DateTime? PaidAt { get; private set; }

    private Payment()
    {
    }

    public Payment(int orderId, string customerId, decimal amount, PaymentMethod paymentMethod)
    {
        if (string.IsNullOrWhiteSpace(customerId))
        {
            throw new ArgumentException("CustomerId is required.", nameof(customerId));
        }

        if (amount <= 0)
        {
            throw new ArgumentException("Amount must be positive.", nameof(amount));
        }

        OrderId = orderId;
        CustomerId = customerId;
        Amount = amount;
        PaymentMethod = paymentMethod;
        PaymentStatus = PaymentStatus.Pending;
    }

    public void MarkAsPaid(string transactionId)
    {
        if (string.IsNullOrWhiteSpace(transactionId))
        {
            throw new ArgumentException("Transaction id is required.", nameof(transactionId));
        }

        TransactionId = transactionId;
        PaymentStatus = PaymentStatus.Paid;
        PaidAt = DateTime.UtcNow;
    }

    public void MarkAsFailed()
    {
        PaymentStatus = PaymentStatus.Failed;
    }

    public void Refund()
    {
        if (PaymentStatus != PaymentStatus.Paid)
        {
            throw new InvalidOperationException("Only a paid payment can be refunded.");
        }

        PaymentStatus = PaymentStatus.Refunded;
    }
}
