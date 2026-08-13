using RooftopGarden.Application.Common.Models.Identity;

namespace RooftopGarden.Application.Features.Customers.Dtos;

public static class CustomerDtoExtensions
{
    public static CustomerDto ToDto(this CustomerAccount account) =>
        new(account.Id, account.Email, account.FullName, account.PhoneNumber, account.Address, account.IsLockedOut);
}
