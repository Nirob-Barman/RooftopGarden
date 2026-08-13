using MediatR;
using Microsoft.EntityFrameworkCore;
using RooftopGarden.Application.Common.Interfaces;
using RooftopGarden.Application.Common.Models;
using RooftopGarden.Application.Features.Payments.Dtos;

namespace RooftopGarden.Application.Features.Payments.Queries.GetAdminPayments;

public class GetAdminPaymentsQueryHandler : IRequestHandler<GetAdminPaymentsQuery, PagedResult<PaymentDto>>
{
    private readonly IApplicationDbContext _dbContext;

    public GetAdminPaymentsQueryHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PagedResult<PaymentDto>> Handle(GetAdminPaymentsQuery request, CancellationToken cancellationToken)
    {
        var query = _dbContext.Payments.AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.CustomerId))
        {
            query = query.Where(p => p.CustomerId == request.CustomerId);
        }

        if (request.Status.HasValue)
        {
            query = query.Where(p => p.PaymentStatus == request.Status.Value);
        }

        var totalCount = await query.CountAsync(cancellationToken);

        var pageNumber = request.PageNumber < 1 ? 1 : request.PageNumber;
        var pageSize = request.PageSize is < 1 or > 100 ? 20 : request.PageSize;

        var payments = await query
            .OrderByDescending(p => p.Id)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        var items = payments.Select(p => p.ToDto()).ToList();

        return new PagedResult<PaymentDto>(items, totalCount, pageNumber, pageSize);
    }
}
