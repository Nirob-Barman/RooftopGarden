using MediatR;
using RooftopGarden.Application.Common.Interfaces;
using RooftopGarden.Application.Features.Blogs.Dtos;
using RooftopGarden.Domain.Entities;

namespace RooftopGarden.Application.Features.Blogs.Commands.CreateBlog;

public class CreateBlogCommandHandler : IRequestHandler<CreateBlogCommand, BlogDto>
{
    private readonly IApplicationDbContext _dbContext;

    public CreateBlogCommandHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<BlogDto> Handle(CreateBlogCommand request, CancellationToken cancellationToken)
    {
        var blog = new Blog(request.Title, request.Content, request.AuthorId, request.ImageUrl);

        _dbContext.Blogs.Add(blog);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return blog.ToDto();
    }
}
