using MediatR;
using RooftopGarden.Application.Common.Exceptions;
using RooftopGarden.Application.Common.Interfaces;
using RooftopGarden.Application.Features.Customers.Dtos;

namespace RooftopGarden.Application.Features.Customers.Queries.GetCustomerById;

public class GetCustomerByIdQueryHandler : IRequestHandler<GetCustomerByIdQuery, CustomerDto>
{
    private readonly IIdentityService _identityService;

    public GetCustomerByIdQueryHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<CustomerDto> Handle(GetCustomerByIdQuery request, CancellationToken cancellationToken)
    {
        var account = await _identityService.GetCustomerAccountByIdAsync(request.CustomerId)
            ?? throw new NotFoundException("Customer", request.CustomerId);

        return account.ToDto();
    }
}
