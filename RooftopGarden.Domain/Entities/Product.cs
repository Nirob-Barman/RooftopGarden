using RooftopGarden.Domain.Common;
using RooftopGarden.Domain.Enums;

namespace RooftopGarden.Domain.Entities;

public class Product : BaseEntity
{
    public string Name { get; private set; } = string.Empty;
    public string? Description { get; private set; }
    public decimal Price { get; private set; }
    public int StockQuantity { get; private set; }
    public string? ImageUrl { get; private set; }
    public string? CloudinaryPublicId { get; private set; }

    public int CategoryId { get; private set; }
    public Category Category { get; private set; } = null!;

    public PlantType PlantType { get; private set; }
    public SunlightRequirement SunlightRequirement { get; private set; }
    public WaterRequirement WaterRequirement { get; private set; }

    public bool IsActive { get; private set; } = true;
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    private readonly List<OrderItem> _orderItems = new();
    public IReadOnlyCollection<OrderItem> OrderItems => _orderItems.AsReadOnly();

    private readonly List<Review> _reviews = new();
    public IReadOnlyCollection<Review> Reviews => _reviews.AsReadOnly();

    private readonly List<Wishlist> _wishlistedBy = new();
    public IReadOnlyCollection<Wishlist> WishlistedBy => _wishlistedBy.AsReadOnly();

    private readonly List<CartItem> _cartItems = new();
    public IReadOnlyCollection<CartItem> CartItems => _cartItems.AsReadOnly();

    private Product()
    {
    }

    public Product(
        string name,
        decimal price,
        int stockQuantity,
        int categoryId,
        PlantType plantType,
        SunlightRequirement sunlightRequirement,
        WaterRequirement waterRequirement,
        string? description = null,
        string? imageUrl = null)
    {
        SetName(name);
        SetPrice(price);
        SetStock(stockQuantity);
        CategoryId = categoryId;
        PlantType = plantType;
        SunlightRequirement = sunlightRequirement;
        WaterRequirement = waterRequirement;
        Description = description;
        ImageUrl = imageUrl;
        IsActive = true;
        CreatedAt = DateTime.UtcNow;
    }

    public void UpdateDetails(
        string name,
        decimal price,
        int categoryId,
        PlantType plantType,
        SunlightRequirement sunlightRequirement,
        WaterRequirement waterRequirement,
        string? description)
    {
        SetName(name);
        SetPrice(price);
        CategoryId = categoryId;
        PlantType = plantType;
        SunlightRequirement = sunlightRequirement;
        WaterRequirement = waterRequirement;
        Description = description;
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetImage(string imageUrl, string publicId)
    {
        if (string.IsNullOrWhiteSpace(imageUrl))
        {
            throw new ArgumentException(
                "Image URL cannot be empty.",
                nameof(imageUrl));
        }

        if (string.IsNullOrWhiteSpace(publicId))
        {
            throw new ArgumentException(
                "Cloudinary public ID cannot be empty.",
                nameof(publicId));
        }

        ImageUrl = imageUrl;
        CloudinaryPublicId = publicId;
        UpdatedAt = DateTime.UtcNow;
    }


    public void RemoveImage()
    {
        ImageUrl = null;
        CloudinaryPublicId = null;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Activate()
    {
        IsActive = true;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Deactivate()
    {
        IsActive = false;
        UpdatedAt = DateTime.UtcNow;
    }

    public bool CanBeOrdered(int quantity) => IsActive && quantity > 0 && StockQuantity >= quantity;

    public void DecreaseStock(int quantity)
    {
        if (quantity <= 0)
        {
            throw new ArgumentException("Quantity must be positive.", nameof(quantity));
        }

        if (StockQuantity < quantity)
        {
            throw new InvalidOperationException("Insufficient stock.");
        }

        StockQuantity -= quantity;
        UpdatedAt = DateTime.UtcNow;
    }

    public void IncreaseStock(int quantity)
    {
        if (quantity <= 0)
        {
            throw new ArgumentException("Quantity must be positive.", nameof(quantity));
        }

        StockQuantity += quantity;
        UpdatedAt = DateTime.UtcNow;
    }

    public void AdjustStockTo(int newQuantity)
    {
        if (newQuantity < 0)
        {
            throw new ArgumentException("Stock quantity cannot be negative.", nameof(newQuantity));
        }

        StockQuantity = newQuantity;
        UpdatedAt = DateTime.UtcNow;
    }

    private void SetName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException("Product name is required.", nameof(name));
        }

        Name = name;
    }

    private void SetPrice(decimal price)
    {
        if (price < 0)
        {
            throw new ArgumentException("Price cannot be negative.", nameof(price));
        }

        Price = price;
    }

    private void SetStock(int stockQuantity)
    {
        if (stockQuantity < 0)
        {
            throw new ArgumentException("Stock quantity cannot be negative.", nameof(stockQuantity));
        }

        StockQuantity = stockQuantity;
    }
}
