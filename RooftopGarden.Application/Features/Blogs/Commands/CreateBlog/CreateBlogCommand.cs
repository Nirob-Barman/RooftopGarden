using MediatR;
using RooftopGarden.Application.Features.Blogs.Dtos;

namespace RooftopGarden.Application.Features.Blogs.Commands.CreateBlog;

public record CreateBlogCommand(string AuthorId, string Title, string Content, string? ImageUrl) : IRequest<BlogDto>;
