using RooftopGarden.Domain.Common;

namespace RooftopGarden.Domain.Entities;

public class Blog : BaseEntity
{
    public string Title { get; private set; } = string.Empty;
    public string Content { get; private set; } = string.Empty;
    public string? ImageUrl { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }
    public string AuthorId { get; private set; } = string.Empty;

    private Blog()
    {
    }

    public Blog(string title, string content, string authorId, string? imageUrl = null)
    {
        SetTitle(title);
        SetContent(content);

        if (string.IsNullOrWhiteSpace(authorId))
        {
            throw new ArgumentException("AuthorId is required.", nameof(authorId));
        }

        AuthorId = authorId;
        ImageUrl = imageUrl;
        CreatedAt = DateTime.UtcNow;
    }

    public void Update(string title, string content, string? imageUrl)
    {
        SetTitle(title);
        SetContent(content);
        ImageUrl = imageUrl;
        UpdatedAt = DateTime.UtcNow;
    }

    private void SetTitle(string title)
    {
        if (string.IsNullOrWhiteSpace(title))
        {
            throw new ArgumentException("Title is required.", nameof(title));
        }

        Title = title;
    }

    private void SetContent(string content)
    {
        if (string.IsNullOrWhiteSpace(content))
        {
            throw new ArgumentException("Content is required.", nameof(content));
        }

        Content = content;
    }
}
