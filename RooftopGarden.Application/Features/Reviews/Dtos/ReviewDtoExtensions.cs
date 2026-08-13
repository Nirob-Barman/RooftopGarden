using RooftopGarden.Domain.Entities;

namespace RooftopGarden.Application.Features.Reviews.Dtos;

public static class ReviewDtoExtensions
{
    public static ReviewDto ToDto(this Review review) => new(
        review.Id,
        review.ProductId,
        review.CustomerId,
        review.Rating,
        review.Comment,
        review.CreatedAt);
}
