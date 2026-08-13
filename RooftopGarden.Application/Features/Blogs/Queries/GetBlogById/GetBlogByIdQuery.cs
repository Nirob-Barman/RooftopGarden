using MediatR;
using RooftopGarden.Application.Features.Blogs.Dtos;

namespace RooftopGarden.Application.Features.Blogs.Queries.GetBlogById;

public record GetBlogByIdQuery(int Id) : IRequest<BlogDto>;
