using MediatR;
using RooftopGarden.Application.Features.Reviews.Dtos;

namespace RooftopGarden.Application.Features.Reviews.Commands.UpdateReview;

public record UpdateReviewCommand(string CustomerId, int ReviewId, int Rating, string? Comment) : IRequest<ReviewDto>;
