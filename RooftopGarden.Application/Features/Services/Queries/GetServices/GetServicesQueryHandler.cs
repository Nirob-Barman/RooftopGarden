using MediatR;
using Microsoft.EntityFrameworkCore;
using RooftopGarden.Application.Common.Interfaces;
using RooftopGarden.Application.Common.Models;
using RooftopGarden.Application.Features.Services.Dtos;

namespace RooftopGarden.Application.Features.Services.Queries.GetServices;

public class GetServicesQueryHandler : IRequestHandler<GetServicesQuery, PagedResult<ServiceDto>>
{
    private readonly IApplicationDbContext _dbContext;

    public GetServicesQueryHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PagedResult<ServiceDto>> Handle(GetServicesQuery request, CancellationToken cancellationToken)
    {
        var query = _dbContext.Services.AsQueryable();

        if (!request.IncludeInactive)
        {
            query = query.Where(s => s.IsActive);
        }

        var totalCount = await query.CountAsync(cancellationToken);

        var pageNumber = request.PageNumber < 1 ? 1 : request.PageNumber;
        var pageSize = request.PageSize is < 1 or > 100 ? 20 : request.PageSize;

        var services = await query
            .OrderBy(s => s.Name)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        var items = services.Select(s => s.ToDto()).ToList();

        return new PagedResult<ServiceDto>(items, totalCount, pageNumber, pageSize);
    }
}
