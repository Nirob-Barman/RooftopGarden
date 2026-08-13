using MediatR;
using Microsoft.EntityFrameworkCore;
using RooftopGarden.Application.Common.Exceptions;
using RooftopGarden.Application.Common.Interfaces;
using RooftopGarden.Application.Features.Reviews.Dtos;

namespace RooftopGarden.Application.Features.Reviews.Commands.UpdateReview;

public class UpdateReviewCommandHandler : IRequestHandler<UpdateReviewCommand, ReviewDto>
{
    private readonly IApplicationDbContext _dbContext;

    public UpdateReviewCommandHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ReviewDto> Handle(UpdateReviewCommand request, CancellationToken cancellationToken)
    {
        var review = await _dbContext.Reviews
            .FirstOrDefaultAsync(r => r.Id == request.ReviewId && r.CustomerId == request.CustomerId, cancellationToken)
            ?? throw new NotFoundException("Review", request.ReviewId);

        review.Update(request.Rating, request.Comment);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return review.ToDto();
    }
}
