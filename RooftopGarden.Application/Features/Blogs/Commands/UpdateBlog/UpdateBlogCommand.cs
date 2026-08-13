using MediatR;
using RooftopGarden.Application.Features.Blogs.Dtos;

namespace RooftopGarden.Application.Features.Blogs.Commands.UpdateBlog;

public record UpdateBlogCommand(int Id, string Title, string Content, string? ImageUrl) : IRequest<BlogDto>;
