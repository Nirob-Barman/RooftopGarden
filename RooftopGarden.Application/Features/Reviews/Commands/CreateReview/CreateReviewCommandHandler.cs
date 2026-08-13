using MediatR;
using Microsoft.EntityFrameworkCore;
using RooftopGarden.Application.Common.Exceptions;
using RooftopGarden.Application.Common.Interfaces;
using RooftopGarden.Application.Features.Reviews.Dtos;
using RooftopGarden.Domain.Entities;
using RooftopGarden.Domain.Enums;

namespace RooftopGarden.Application.Features.Reviews.Commands.CreateReview;

public class CreateReviewCommandHandler : IRequestHandler<CreateReviewCommand, ReviewDto>
{
    private readonly IApplicationDbContext _dbContext;

    public CreateReviewCommandHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ReviewDto> Handle(CreateReviewCommand request, CancellationToken cancellationToken)
    {
        var productExists = await _dbContext.Products.AnyAsync(p => p.Id == request.ProductId, cancellationToken);
        if (!productExists)
        {
            throw new NotFoundException("Product", request.ProductId);
        }

        var hasPurchased = await _dbContext.Orders
            .Where(o => o.CustomerId == request.CustomerId && o.OrderStatus != OrderStatus.Cancelled)
            .SelectMany(o => o.OrderItems)
            .AnyAsync(oi => oi.ProductId == request.ProductId, cancellationToken);

        if (!hasPurchased)
        {
            throw new BadRequestException("You can only review products you have purchased.");
        }

        var alreadyReviewed = await _dbContext.Reviews
            .AnyAsync(r => r.CustomerId == request.CustomerId && r.ProductId == request.ProductId, cancellationToken);

        if (alreadyReviewed)
        {
            throw new BadRequestException("You have already reviewed this product. Update your existing review instead.");
        }

        var review = new Review(request.ProductId, request.CustomerId, request.Rating, request.Comment);

        _dbContext.Reviews.Add(review);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return review.ToDto();
    }
}
