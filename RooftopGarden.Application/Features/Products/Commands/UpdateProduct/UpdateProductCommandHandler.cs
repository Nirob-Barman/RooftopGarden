using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using RooftopGarden.Application.Common.Exceptions;
using RooftopGarden.Application.Common.Interfaces;
using RooftopGarden.Application.Features.Products.Dtos;

namespace RooftopGarden.Application.Features.Products.Commands.UpdateProduct;

public class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand, ProductDto>
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IImageStorage _imageStorage;
    private readonly ILogger<UpdateProductCommandHandler> _logger;

    public UpdateProductCommandHandler(IApplicationDbContext dbContext, IImageStorage imageStorage, ILogger<UpdateProductCommandHandler> logger)
    {
        _dbContext = dbContext;
        _imageStorage = imageStorage;
        _logger = logger;
    }

    public async Task<ProductDto> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        var product = await _dbContext.Products.FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException("Product", request.Id);

        var category = await _dbContext.Categories.FirstOrDefaultAsync(c => c.Id == request.CategoryId, cancellationToken)
            ?? throw new NotFoundException("Category", request.CategoryId);

        // Keep the old Cloudinary ID so we can delete it later.
        var oldCloudinaryPublicId = product.CloudinaryPublicId;
        string? newCloudinaryPublicId = null;

        try
        {
            product.UpdateDetails(
            request.Name,
            request.Price,
            request.CategoryId,
            request.PlantType,
            request.SunlightRequirement,
            request.WaterRequirement,
            request.Description);

            product.AdjustStockTo(request.StockQuantity);

            // A new image was selected
            if (request.Image is not null)
            {
                var storedImage = await _imageStorage.UploadAsync(request.Image, cancellationToken);
                newCloudinaryPublicId = storedImage.PublicId;
                product.SetImage(storedImage.Url, storedImage.PublicId);
            }

            await _dbContext.SaveChangesAsync(cancellationToken);
        }
        catch (Exception)
        {
            // Database failed after the new image was uploaded.
            // Delete the new image because it is no longer referenced.
            if (!string.IsNullOrWhiteSpace(newCloudinaryPublicId))
            {
                try
                {
                    await _imageStorage.DeleteAsync(newCloudinaryPublicId, CancellationToken.None);
                }
                catch (Exception cleanupException)
                {
                    _logger.LogError(cleanupException, "Failed to clean up new Cloudinary image {PublicId} after product {ProductId} update failed.", newCloudinaryPublicId, request.Id);
                }
            }
            throw;
        }

        // Only delete the old image after the database update succeeds.
        if (request.Image is not null && !string.IsNullOrWhiteSpace(oldCloudinaryPublicId))
        {
            try
            {
                await _imageStorage.DeleteAsync(oldCloudinaryPublicId, CancellationToken.None);
            }
            catch (Exception cleanupException)
            {
                _logger.LogError(cleanupException, "Failed to delete old Cloudinary image {PublicId} after product {ProductId} was updated.", oldCloudinaryPublicId, request.Id);
            }
        }

        return product.ToDto(category.Name);
    }
}
