namespace RooftopGarden.Application.Features.Blogs.Dtos;

public record BlogDto(int Id, string Title, string Content, string? ImageUrl, string AuthorId, DateTime CreatedAt, DateTime? UpdatedAt);
