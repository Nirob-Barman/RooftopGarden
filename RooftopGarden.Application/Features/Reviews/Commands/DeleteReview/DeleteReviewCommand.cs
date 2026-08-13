using MediatR;

namespace RooftopGarden.Application.Features.Reviews.Commands.DeleteReview;

public record DeleteReviewCommand(string CustomerId, int ReviewId) : IRequest<Unit>;
