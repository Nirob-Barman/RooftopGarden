using RooftopGarden.Domain.Entities;

namespace RooftopGarden.Application.Features.Blogs.Dtos;

public static class BlogDtoExtensions
{
    public static BlogDto ToDto(this Blog blog) => new(
        blog.Id,
        blog.Title,
        blog.Content,
        blog.ImageUrl,
        blog.AuthorId,
        blog.CreatedAt,
        blog.UpdatedAt);
}
