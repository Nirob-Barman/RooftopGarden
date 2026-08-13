using MediatR;
using RooftopGarden.Application.Common.Exceptions;
using RooftopGarden.Application.Common.Interfaces;
using RooftopGarden.Application.Features.Customers.Dtos;

namespace RooftopGarden.Application.Features.Customers.Commands.UnlockCustomer;

public class UnlockCustomerCommandHandler : IRequestHandler<UnlockCustomerCommand, CustomerDto>
{
    private readonly IIdentityService _identityService;

    public UnlockCustomerCommandHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<CustomerDto> Handle(UnlockCustomerCommand request, CancellationToken cancellationToken)
    {
        var existing = await _identityService.GetCustomerAccountByIdAsync(request.CustomerId)
            ?? throw new NotFoundException("Customer", request.CustomerId);

        if (existing.IsLockedOut)
        {
            await _identityService.SetCustomerLockoutAsync(request.CustomerId, locked: false);
        }

        var updated = await _identityService.GetCustomerAccountByIdAsync(request.CustomerId)
            ?? throw new NotFoundException("Customer", request.CustomerId);

        return updated.ToDto();
    }
}
