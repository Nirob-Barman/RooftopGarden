using RooftopGarden.Domain.Common;

namespace RooftopGarden.Domain.Entities;

public class Wishlist : BaseEntity
{
    public string CustomerId { get; private set; } = string.Empty;

    public int ProductId { get; private set; }
    public Product Product { get; private set; } = null!;

    public DateTime CreatedAt { get; private set; }

    private Wishlist()
    {
    }

    public Wishlist(string customerId, int productId)
    {
        if (string.IsNullOrWhiteSpace(customerId))
        {
            throw new ArgumentException("CustomerId is required.", nameof(customerId));
        }

        CustomerId = customerId;
        ProductId = productId;
        CreatedAt = DateTime.UtcNow;
    }
}
