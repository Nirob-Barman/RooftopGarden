namespace RooftopGarden.Application.Features.Blogs.Dtos;

public record UpdateBlogRequest(string Title, string Content, string? ImageUrl);
