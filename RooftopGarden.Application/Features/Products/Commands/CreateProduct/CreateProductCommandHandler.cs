using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using RooftopGarden.Application.Common.Exceptions;
using RooftopGarden.Application.Common.Interfaces;
using RooftopGarden.Application.Features.Products.Dtos;
using RooftopGarden.Domain.Entities;

namespace RooftopGarden.Application.Features.Products.Commands.CreateProduct;

public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, ProductDto>
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IImageStorage _imageStorage;
    private readonly ILogger<CreateProductCommandHandler> _logger;

    public CreateProductCommandHandler(IApplicationDbContext dbContext, IImageStorage imageStorage, ILogger<CreateProductCommandHandler> logger)
    {
        _dbContext = dbContext;
        _imageStorage = imageStorage;
        _logger = logger;
    }

    public async Task<ProductDto> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        var category = await _dbContext.Categories.FirstOrDefaultAsync(c => c.Id == request.CategoryId, cancellationToken)
            ?? throw new NotFoundException("Category", request.CategoryId);

        var product = new Product(
            request.Name,
            request.Price,
            request.StockQuantity,
            request.CategoryId,
            request.PlantType,
            request.SunlightRequirement,
            request.WaterRequirement,
            request.Description);

        string? uploadedPublicId = null;

        try
        {
            if (request.Image is not null)
            {
                var storedImage = await _imageStorage.UploadAsync(request.Image,cancellationToken);
                uploadedPublicId = storedImage.PublicId;
                product.SetImage(storedImage.Url, storedImage.PublicId);
            }

            _dbContext.Products.Add(product);
            await _dbContext.SaveChangesAsync(cancellationToken);

            return product.ToDto(category.Name);
        }
        catch
        {
            // Database failed after Cloudinary upload
            if (!string.IsNullOrWhiteSpace(uploadedPublicId))
            {
                try
                {
                    await _imageStorage.DeleteAsync(uploadedPublicId, CancellationToken.None);
                }
                catch(Exception cleanupException)
                {
                    _logger.LogError(cleanupException, "Failed to clean up Cloudinary image {PublicId} after product creation failed.", uploadedPublicId);
                }
            }
            throw;
        }
    }
}
