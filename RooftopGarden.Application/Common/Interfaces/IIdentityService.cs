using RooftopGarden.Application.Common.Models;
using RooftopGarden.Application.Common.Models.Identity;

namespace RooftopGarden.Application.Common.Interfaces;

public interface IIdentityService
{
    Task<IdentityOperationResult> CreateCustomerAsync(string email, string password, string fullName, string? phoneNumber);

    Task<AuthenticatedUser?> ValidateCredentialsAsync(string email, string password);

    Task<UserProfile?> GetProfileAsync(string userId);

    Task<bool> UpdateProfileAsync(string userId, string fullName, string? phoneNumber, string? address, string? profileImageUrl);

    Task<int> GetCustomerCountAsync();

    Task<PagedResult<CustomerAccount>> GetCustomersAsync(string? search, int pageNumber, int pageSize);

    Task<CustomerAccount?> GetCustomerAccountByIdAsync(string userId);

    Task<bool> SetCustomerLockoutAsync(string userId, bool locked);
}
