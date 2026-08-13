using RooftopGarden.Domain.Common;

namespace RooftopGarden.Domain.Entities;

public class Category : BaseEntity
{
    public string Name { get; private set; } = string.Empty;
    public string? Description { get; private set; }

    private readonly List<Product> _products = new();
    public IReadOnlyCollection<Product> Products => _products.AsReadOnly();

    private Category()
    {
    }

    public Category(string name, string? description = null)
    {
        SetName(name);
        Description = description;
    }

    public void Update(string name, string? description)
    {
        SetName(name);
        Description = description;
    }

    private void SetName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException("Category name is required.", nameof(name));
        }

        Name = name;
    }
}
