using RooftopGarden.Domain.Common;

namespace RooftopGarden.Domain.Entities;

public class OrderItem : BaseEntity
{
    public int OrderId { get; private set; }
    public Order Order { get; private set; } = null!;

    public int ProductId { get; private set; }
    public Product Product { get; private set; } = null!;

    public int Quantity { get; private set; }
    public decimal UnitPrice { get; private set; }
    public decimal SubTotal { get; private set; }

    private OrderItem()
    {
    }

    internal OrderItem(int productId, int quantity, decimal unitPrice)
    {
        if (quantity <= 0)
        {
            throw new ArgumentException("Quantity must be positive.", nameof(quantity));
        }

        if (unitPrice < 0)
        {
            throw new ArgumentException("Unit price cannot be negative.", nameof(unitPrice));
        }

        ProductId = productId;
        Quantity = quantity;
        UnitPrice = unitPrice;
        SubTotal = quantity * unitPrice;
    }
}
