using MediatR;
using Microsoft.EntityFrameworkCore;
using RooftopGarden.Application.Common.Exceptions;
using RooftopGarden.Application.Common.Interfaces;
using RooftopGarden.Application.Features.Reviews.Dtos;

namespace RooftopGarden.Application.Features.Reviews.Queries.GetReviewById;

public class GetReviewByIdQueryHandler : IRequestHandler<GetReviewByIdQuery, ReviewDto>
{
    private readonly IApplicationDbContext _dbContext;

    public GetReviewByIdQueryHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ReviewDto> Handle(GetReviewByIdQuery request, CancellationToken cancellationToken)
    {
        var review = await _dbContext.Reviews.FirstOrDefaultAsync(r => r.Id == request.ReviewId, cancellationToken)
            ?? throw new NotFoundException("Review", request.ReviewId);

        return review.ToDto();
    }
}
