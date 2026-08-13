using MediatR;
using RooftopGarden.Application.Features.Reviews.Dtos;

namespace RooftopGarden.Application.Features.Reviews.Queries.GetReviewById;

public record GetReviewByIdQuery(int ReviewId) : IRequest<ReviewDto>;
