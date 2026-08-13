namespace RooftopGarden.Application.Features.Blogs.Dtos;

public record CreateBlogRequest(string Title, string Content, string? ImageUrl);
