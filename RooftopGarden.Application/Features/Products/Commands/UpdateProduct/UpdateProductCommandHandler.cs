using MediatR;
using Microsoft.EntityFrameworkCore;
using RooftopGarden.Application.Common.Exceptions;
using RooftopGarden.Application.Common.Interfaces;
using RooftopGarden.Application.Features.Products.Dtos;

namespace RooftopGarden.Application.Features.Products.Commands.UpdateProduct;

public class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand, ProductDto>
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IImageStorage _imageStorage;

    public UpdateProductCommandHandler(IApplicationDbContext dbContext, IImageStorage imageStorage)
    {
        _dbContext = dbContext;
        _imageStorage = imageStorage;
    }

    public async Task<ProductDto> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        var product = await _dbContext.Products.FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException("Product", request.Id);

        var category = await _dbContext.Categories.FirstOrDefaultAsync(c => c.Id == request.CategoryId, cancellationToken)
            ?? throw new NotFoundException("Category", request.CategoryId);

        // Keep the old Cloudinary ID so we can delete it later.
        var oldCloudinaryPublicId = product.CloudinaryPublicId;

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
            product.SetImage(storedImage.Url, storedImage.PublicId);
        }

        await _dbContext.SaveChangesAsync(cancellationToken);

        // Only delete the old image after the database update succeeds.
        if (request.Image is not null && !string.IsNullOrWhiteSpace(oldCloudinaryPublicId))
        {
            await _imageStorage.DeleteAsync(oldCloudinaryPublicId, cancellationToken);
        }

        return product.ToDto(category.Name);
    }
}
