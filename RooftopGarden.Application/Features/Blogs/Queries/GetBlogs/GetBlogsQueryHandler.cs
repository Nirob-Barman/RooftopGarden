using MediatR;
using Microsoft.EntityFrameworkCore;
using RooftopGarden.Application.Common.Interfaces;
using RooftopGarden.Application.Common.Models;
using RooftopGarden.Application.Features.Blogs.Dtos;

namespace RooftopGarden.Application.Features.Blogs.Queries.GetBlogs;

public class GetBlogsQueryHandler : IRequestHandler<GetBlogsQuery, PagedResult<BlogDto>>
{
    private readonly IApplicationDbContext _dbContext;

    public GetBlogsQueryHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PagedResult<BlogDto>> Handle(GetBlogsQuery request, CancellationToken cancellationToken)
    {
        var query = _dbContext.Blogs.AsQueryable();

        var totalCount = await query.CountAsync(cancellationToken);

        var pageNumber = request.PageNumber < 1 ? 1 : request.PageNumber;
        var pageSize = request.PageSize is < 1 or > 100 ? 20 : request.PageSize;

        var blogs = await query
            .OrderByDescending(b => b.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        var items = blogs.Select(b => b.ToDto()).ToList();

        return new PagedResult<BlogDto>(items, totalCount, pageNumber, pageSize);
    }
}
