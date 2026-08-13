using MediatR;
using Microsoft.EntityFrameworkCore;
using RooftopGarden.Application.Common.Exceptions;
using RooftopGarden.Application.Common.Interfaces;

namespace RooftopGarden.Application.Features.Reviews.Commands.AdminDeleteReview;

public class AdminDeleteReviewCommandHandler : IRequestHandler<AdminDeleteReviewCommand, Unit>
{
    private readonly IApplicationDbContext _dbContext;

    public AdminDeleteReviewCommandHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Unit> Handle(AdminDeleteReviewCommand request, CancellationToken cancellationToken)
    {
        var review = await _dbContext.Reviews.FirstOrDefaultAsync(r => r.Id == request.ReviewId, cancellationToken)
            ?? throw new NotFoundException("Review", request.ReviewId);

        _dbContext.Reviews.Remove(review);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
