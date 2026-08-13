using MediatR;
using Microsoft.EntityFrameworkCore;
using RooftopGarden.Application.Common.Exceptions;
using RooftopGarden.Application.Common.Interfaces;
using RooftopGarden.Application.Features.Categories.Dtos;

namespace RooftopGarden.Application.Features.Categories.Commands.UpdateCategory;

public class UpdateCategoryCommandHandler : IRequestHandler<UpdateCategoryCommand, CategoryDto>
{
    private readonly IApplicationDbContext _dbContext;

    public UpdateCategoryCommandHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<CategoryDto> Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await _dbContext.Categories.FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException("Category", request.Id);

        var nameTaken = await _dbContext.Categories.AnyAsync(
            c => c.Name == request.Name && c.Id != request.Id,
            cancellationToken);
        if (nameTaken)
        {
            throw new BadRequestException($"A category named '{request.Name}' already exists.");
        }

        category.Update(request.Name, request.Description);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return category.ToDto();
    }
}
