using MediatR;
using Microsoft.EntityFrameworkCore;
using RooftopGarden.Application.Common.Exceptions;
using RooftopGarden.Application.Common.Interfaces;

namespace RooftopGarden.Application.Features.Reviews.Commands.DeleteReview;

public class DeleteReviewCommandHandler : IRequestHandler<DeleteReviewCommand, Unit>
{
    private readonly IApplicationDbContext _dbContext;

    public DeleteReviewCommandHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Unit> Handle(DeleteReviewCommand request, CancellationToken cancellationToken)
    {
        var review = await _dbContext.Reviews
            .FirstOrDefaultAsync(r => r.Id == request.ReviewId && r.CustomerId == request.CustomerId, cancellationToken)
            ?? throw new NotFoundException("Review", request.ReviewId);

        _dbContext.Reviews.Remove(review);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
