using MediatR;
using RooftopGarden.Application.Features.Categories.Dtos;

namespace RooftopGarden.Application.Features.Categories.Queries.GetCategoryById;

public record GetCategoryByIdQuery(int Id) : IRequest<CategoryDto>;
