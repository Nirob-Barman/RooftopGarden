using RooftopGarden.Domain.Common;

namespace RooftopGarden.Domain.Entities;

public class CartItem : BaseEntity
{
    public int CartId { get; private set; }
    public Cart Cart { get; private set; } = null!;

    public int ProductId { get; private set; }
    public Product Product { get; private set; } = null!;

    public int Quantity { get; private set; }

    private CartItem()
    {
    }

    internal CartItem(int productId, int quantity)
    {
        ProductId = productId;
        SetQuantity(quantity);
    }

    internal void SetQuantity(int quantity)
    {
        if (quantity <= 0)
        {
            throw new ArgumentException("Quantity must be positive.", nameof(quantity));
        }

        Quantity = quantity;
    }
}
