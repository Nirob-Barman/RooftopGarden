using MediatR;
using RooftopGarden.Application.Common.Exceptions;
using RooftopGarden.Application.Common.Interfaces;
using RooftopGarden.Application.Features.Customers.Dtos;

namespace RooftopGarden.Application.Features.Customers.Commands.LockCustomer;

public class LockCustomerCommandHandler : IRequestHandler<LockCustomerCommand, CustomerDto>
{
    private readonly IIdentityService _identityService;

    public LockCustomerCommandHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<CustomerDto> Handle(LockCustomerCommand request, CancellationToken cancellationToken)
    {
        var existing = await _identityService.GetCustomerAccountByIdAsync(request.CustomerId)
            ?? throw new NotFoundException("Customer", request.CustomerId);

        if (!existing.IsLockedOut)
        {
            await _identityService.SetCustomerLockoutAsync(request.CustomerId, locked: true);
        }

        var updated = await _identityService.GetCustomerAccountByIdAsync(request.CustomerId)
            ?? throw new NotFoundException("Customer", request.CustomerId);

        return updated.ToDto();
    }
}
