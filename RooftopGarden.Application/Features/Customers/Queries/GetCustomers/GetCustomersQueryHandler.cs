using MediatR;
using RooftopGarden.Application.Common.Interfaces;
using RooftopGarden.Application.Common.Models;
using RooftopGarden.Application.Features.Customers.Dtos;

namespace RooftopGarden.Application.Features.Customers.Queries.GetCustomers;

public class GetCustomersQueryHandler : IRequestHandler<GetCustomersQuery, PagedResult<CustomerDto>>
{
    private readonly IIdentityService _identityService;

    public GetCustomersQueryHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<PagedResult<CustomerDto>> Handle(GetCustomersQuery request, CancellationToken cancellationToken)
    {
        var result = await _identityService.GetCustomersAsync(request.Search, request.PageNumber, request.PageSize);

        return new PagedResult<CustomerDto>(
            result.Items.Select(c => c.ToDto()).ToList(),
            result.TotalCount,
            result.PageNumber,
            result.PageSize);
    }
}
