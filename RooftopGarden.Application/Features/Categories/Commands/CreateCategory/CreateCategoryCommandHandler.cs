using MediatR;
using Microsoft.EntityFrameworkCore;
using RooftopGarden.Application.Common.Exceptions;
using RooftopGarden.Application.Common.Interfaces;
using RooftopGarden.Application.Features.Categories.Dtos;
using RooftopGarden.Domain.Entities;

namespace RooftopGarden.Application.Features.Categories.Commands.CreateCategory;

public class CreateCategoryCommandHandler : IRequestHandler<CreateCategoryCommand, CategoryDto>
{
    private readonly IApplicationDbContext _dbContext;

    public CreateCategoryCommandHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<CategoryDto> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
    {
        var nameExists = await _dbContext.Categories.AnyAsync(c => c.Name == request.Name, cancellationToken);
        if (nameExists)
        {
            throw new BadRequestException($"A category named '{request.Name}' already exists.");
        }

        var category = new Category(request.Name, request.Description);

        _dbContext.Categories.Add(category);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return category.ToDto();
    }
}
