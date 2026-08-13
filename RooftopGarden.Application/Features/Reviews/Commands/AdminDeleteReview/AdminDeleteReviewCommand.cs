using MediatR;

namespace RooftopGarden.Application.Features.Reviews.Commands.AdminDeleteReview;

public record AdminDeleteReviewCommand(int ReviewId) : IRequest<Unit>;
