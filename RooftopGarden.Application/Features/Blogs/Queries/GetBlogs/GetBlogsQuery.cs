using MediatR;
using RooftopGarden.Application.Common.Models;
using RooftopGarden.Application.Features.Blogs.Dtos;

namespace RooftopGarden.Application.Features.Blogs.Queries.GetBlogs;

public record GetBlogsQuery(int PageNumber, int PageSize) : IRequest<PagedResult<BlogDto>>;
