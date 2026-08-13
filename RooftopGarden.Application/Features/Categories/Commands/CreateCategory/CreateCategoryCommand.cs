using MediatR;
using RooftopGarden.Application.Features.Categories.Dtos;

namespace RooftopGarden.Application.Features.Categories.Commands.CreateCategory;

public record CreateCategoryCommand(string Name, string? Description) : IRequest<CategoryDto>;
