using RooftopGarden.Domain.Common;
using RooftopGarden.Domain.Enums;

namespace RooftopGarden.Domain.Entities;

public class Order : BaseEntity
{
    public string CustomerId { get; private set; } = string.Empty;
    public DateTime OrderDate { get; private set; }
    public decimal TotalAmount { get; private set; }
    public string ShippingAddress { get; private set; } = string.Empty;
    public PaymentStatus PaymentStatus { get; private set; }
    public OrderStatus OrderStatus { get; private set; }

    private readonly List<OrderItem> _orderItems = new();
    public IReadOnlyCollection<OrderItem> OrderItems => _orderItems.AsReadOnly();

    public Payment? Payment { get; private set; }

    private Order()
    {
    }

    public Order(string customerId, string shippingAddress)
    {
        if (string.IsNullOrWhiteSpace(customerId))
        {
            throw new ArgumentException("CustomerId is required.", nameof(customerId));
        }

        if (string.IsNullOrWhiteSpace(shippingAddress))
        {
            throw new ArgumentException("Shipping address is required.", nameof(shippingAddress));
        }

        CustomerId = customerId;
        ShippingAddress = shippingAddress;
        OrderDate = DateTime.UtcNow;
        OrderStatus = OrderStatus.Pending;
        PaymentStatus = PaymentStatus.Pending;
    }

    public OrderItem AddItem(int productId, int quantity, decimal unitPrice)
    {
        if (OrderStatus != OrderStatus.Pending)
        {
            throw new InvalidOperationException("Cannot modify an order that is no longer pending.");
        }

        var item = new OrderItem(productId, quantity, unitPrice);
        _orderItems.Add(item);
        RecalculateTotal();
        return item;
    }

    public bool CanBeCancelled() => OrderStatus is OrderStatus.Pending or OrderStatus.Processing;

    public void Cancel()
    {
        if (!CanBeCancelled())
        {
            throw new InvalidOperationException("This order is no longer eligible for cancellation.");
        }

        OrderStatus = OrderStatus.Cancelled;
    }

    public void UpdateStatus(OrderStatus status)
    {
        if (OrderStatus is OrderStatus.Cancelled or OrderStatus.Delivered)
        {
            throw new InvalidOperationException("Cannot change the status of a completed or cancelled order.");
        }

        OrderStatus = status;
    }

    public void MarkPaymentStatus(PaymentStatus status)
    {
        PaymentStatus = status;
    }

    private void RecalculateTotal()
    {
        TotalAmount = _orderItems.Sum(i => i.SubTotal);
    }
}
