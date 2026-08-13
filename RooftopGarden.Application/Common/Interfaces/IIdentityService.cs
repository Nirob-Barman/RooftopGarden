using RooftopGarden.Application.Common.Models.Identity;

namespace RooftopGarden.Application.Common.Interfaces;

public interface IIdentityService
{
    Task<IdentityOperationResult> CreateCustomerAsync(string email, string password, string fullName, string? phoneNumber);

    Task<AuthenticatedUser?> ValidateCredentialsAsync(string email, string password);

    Task<UserProfile?> GetProfileAsync(string userId);

    Task<bool> UpdateProfileAsync(string userId, string fullName, string? phoneNumber, string? address, string? profileImageUrl);
}
