using MediatR;
using RooftopGarden.Application.Features.Categories.Dtos;

namespace RooftopGarden.Application.Features.Categories.Queries.GetCategories;

public record GetCategoriesQuery : IRequest<List<CategoryDto>>;
