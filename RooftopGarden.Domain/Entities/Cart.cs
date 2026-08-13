using RooftopGarden.Domain.Common;

namespace RooftopGarden.Domain.Entities;

public class Cart : BaseEntity
{
    public string CustomerId { get; private set; } = string.Empty;
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    private readonly List<CartItem> _cartItems = new();
    public IReadOnlyCollection<CartItem> CartItems => _cartItems.AsReadOnly();

    private Cart()
    {
    }

    public Cart(string customerId)
    {
        if (string.IsNullOrWhiteSpace(customerId))
        {
            throw new ArgumentException("CustomerId is required.", nameof(customerId));
        }

        CustomerId = customerId;
        CreatedAt = DateTime.UtcNow;
    }

    public CartItem AddOrUpdateItem(int productId, int quantity)
    {
        if (quantity <= 0)
        {
            throw new ArgumentException("Quantity must be positive.", nameof(quantity));
        }

        var existing = _cartItems.FirstOrDefault(i => i.ProductId == productId);
        if (existing is not null)
        {
            existing.SetQuantity(existing.Quantity + quantity);
        }
        else
        {
            existing = new CartItem(productId, quantity);
            _cartItems.Add(existing);
        }

        UpdatedAt = DateTime.UtcNow;
        return existing;
    }

    public void UpdateItemQuantity(int cartItemId, int quantity)
    {
        var item = _cartItems.FirstOrDefault(i => i.Id == cartItemId)
            ?? throw new InvalidOperationException("Cart item not found.");

        if (quantity <= 0)
        {
            _cartItems.Remove(item);
        }
        else
        {
            item.SetQuantity(quantity);
        }

        UpdatedAt = DateTime.UtcNow;
    }

    public void RemoveItem(int cartItemId)
    {
        var item = _cartItems.FirstOrDefault(i => i.Id == cartItemId);
        if (item is not null)
        {
            _cartItems.Remove(item);
            UpdatedAt = DateTime.UtcNow;
        }
    }

    public void Clear()
    {
        _cartItems.Clear();
        UpdatedAt = DateTime.UtcNow;
    }
}
