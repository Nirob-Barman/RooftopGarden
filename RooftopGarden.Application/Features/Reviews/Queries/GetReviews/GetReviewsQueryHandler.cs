using MediatR;
using Microsoft.EntityFrameworkCore;
using RooftopGarden.Application.Common.Interfaces;
using RooftopGarden.Application.Common.Models;
using RooftopGarden.Application.Features.Reviews.Dtos;

namespace RooftopGarden.Application.Features.Reviews.Queries.GetReviews;

public class GetReviewsQueryHandler : IRequestHandler<GetReviewsQuery, PagedResult<ReviewDto>>
{
    private readonly IApplicationDbContext _dbContext;

    public GetReviewsQueryHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PagedResult<ReviewDto>> Handle(GetReviewsQuery request, CancellationToken cancellationToken)
    {
        var query = _dbContext.Reviews.AsQueryable();

        if (request.ProductId.HasValue)
        {
            query = query.Where(r => r.ProductId == request.ProductId.Value);
        }

        if (!string.IsNullOrWhiteSpace(request.CustomerId))
        {
            query = query.Where(r => r.CustomerId == request.CustomerId);
        }

        var totalCount = await query.CountAsync(cancellationToken);

        var pageNumber = request.PageNumber < 1 ? 1 : request.PageNumber;
        var pageSize = request.PageSize is < 1 or > 100 ? 20 : request.PageSize;

        var reviews = await query
            .OrderByDescending(r => r.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        var items = reviews.Select(r => r.ToDto()).ToList();

        return new PagedResult<ReviewDto>(items, totalCount, pageNumber, pageSize);
    }
}
