using RooftopGarden.Domain.Common;

namespace RooftopGarden.Domain.Entities;

public class Review : BaseEntity
{
    public int ProductId { get; private set; }
    public Product Product { get; private set; } = null!;

    public string CustomerId { get; private set; } = string.Empty;
    public int Rating { get; private set; }
    public string? Comment { get; private set; }
    public DateTime CreatedAt { get; private set; }

    private Review()
    {
    }

    public Review(int productId, string customerId, int rating, string? comment = null)
    {
        if (string.IsNullOrWhiteSpace(customerId))
        {
            throw new ArgumentException("CustomerId is required.", nameof(customerId));
        }

        ProductId = productId;
        CustomerId = customerId;
        SetRating(rating);
        Comment = comment;
        CreatedAt = DateTime.UtcNow;
    }

    public void Update(int rating, string? comment)
    {
        SetRating(rating);
        Comment = comment;
    }

    private void SetRating(int rating)
    {
        if (rating < 1 || rating > 5)
        {
            throw new ArgumentOutOfRangeException(nameof(rating), "Rating must be between 1 and 5.");
        }

        Rating = rating;
    }
}
