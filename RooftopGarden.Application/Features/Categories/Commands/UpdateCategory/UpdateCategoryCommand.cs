using MediatR;
using RooftopGarden.Application.Features.Categories.Dtos;

namespace RooftopGarden.Application.Features.Categories.Commands.UpdateCategory;

public record UpdateCategoryCommand(int Id, string Name, string? Description) : IRequest<CategoryDto>;
