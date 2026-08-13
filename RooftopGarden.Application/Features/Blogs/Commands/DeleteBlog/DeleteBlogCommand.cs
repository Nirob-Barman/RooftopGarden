using MediatR;

namespace RooftopGarden.Application.Features.Blogs.Commands.DeleteBlog;

public record DeleteBlogCommand(int Id) : IRequest<Unit>;
