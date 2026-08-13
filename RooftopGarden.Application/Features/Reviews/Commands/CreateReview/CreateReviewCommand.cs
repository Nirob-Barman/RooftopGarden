using MediatR;
using RooftopGarden.Application.Features.Reviews.Dtos;

namespace RooftopGarden.Application.Features.Reviews.Commands.CreateReview;

public record CreateReviewCommand(string CustomerId, int ProductId, int Rating, string? Comment) : IRequest<ReviewDto>;
