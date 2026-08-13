using MediatR;
using RooftopGarden.Application.Common.Models;
using RooftopGarden.Application.Features.Reviews.Dtos;

namespace RooftopGarden.Application.Features.Reviews.Queries.GetReviews;

public record GetReviewsQuery(int? ProductId, string? CustomerId, int PageNumber, int PageSize) : IRequest<PagedResult<ReviewDto>>;
