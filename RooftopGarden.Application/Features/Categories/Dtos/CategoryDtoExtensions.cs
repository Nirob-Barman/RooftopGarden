using RooftopGarden.Domain.Entities;

namespace RooftopGarden.Application.Features.Categories.Dtos;

public static class CategoryDtoExtensions
{
    public static CategoryDto ToDto(this Category category) => new(category.Id, category.Name, category.Description);
}
