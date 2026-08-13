using RooftopGarden.Domain.Common;

namespace RooftopGarden.Domain.Entities;

public class Service : BaseEntity
{
    public string Name { get; private set; } = string.Empty;
    public string? Description { get; private set; }
    public decimal Price { get; private set; }
    public TimeSpan Duration { get; private set; }
    public string? ImageUrl { get; private set; }
    public bool IsActive { get; private set; } = true;

    private readonly List<Booking> _bookings = new();
    public IReadOnlyCollection<Booking> Bookings => _bookings.AsReadOnly();

    private Service()
    {
    }

    public Service(string name, decimal price, TimeSpan duration, string? description = null, string? imageUrl = null)
    {
        SetName(name);
        SetPrice(price);
        Duration = duration;
        Description = description;
        ImageUrl = imageUrl;
        IsActive = true;
    }

    public void UpdateDetails(string name, decimal price, TimeSpan duration, string? description, string? imageUrl)
    {
        SetName(name);
        SetPrice(price);
        Duration = duration;
        Description = description;
        ImageUrl = imageUrl;
    }

    public void Activate() => IsActive = true;

    public void Deactivate() => IsActive = false;

    private void SetName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException("Service name is required.", nameof(name));
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
}
