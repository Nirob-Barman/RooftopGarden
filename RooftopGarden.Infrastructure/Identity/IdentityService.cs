using Microsoft.AspNetCore.Identity;
using RooftopGarden.Application.Common.Interfaces;
using RooftopGarden.Application.Common.Models.Identity;
using RooftopGarden.Domain.Constants;

namespace RooftopGarden.Infrastructure.Identity;

public class IdentityService : IIdentityService
{
    private readonly UserManager<ApplicationUser> _userManager;

    public IdentityService(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    public async Task<IdentityOperationResult> CreateCustomerAsync(string email, string password, string fullName, string? phoneNumber)
    {
        var existing = await _userManager.FindByEmailAsync(email);
        if (existing is not null)
        {
            return new IdentityOperationResult(false, null, new[] { "An account with this email already exists." });
        }

        var user = new ApplicationUser
        {
            UserName = email,
            Email = email,
            FullName = fullName,
            PhoneNumber = phoneNumber,
            EmailConfirmed = true
        };

        var result = await _userManager.CreateAsync(user, password);
        if (!result.Succeeded)
        {
            return new IdentityOperationResult(false, null, result.Errors.Select(e => e.Description).ToArray());
        }

        await _userManager.AddToRoleAsync(user, Roles.Customer);

        return new IdentityOperationResult(true, user.Id, Array.Empty<string>());
    }

    public async Task<AuthenticatedUser?> ValidateCredentialsAsync(string email, string password)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user is null || !await _userManager.CheckPasswordAsync(user, password))
        {
            return null;
        }

        var role = (await _userManager.GetRolesAsync(user)).FirstOrDefault() ?? Roles.Customer;

        return new AuthenticatedUser(user.Id, user.Email!, user.FullName, role);
    }

    public async Task<UserProfile?> GetProfileAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user is null)
        {
            return null;
        }

        var role = (await _userManager.GetRolesAsync(user)).FirstOrDefault() ?? Roles.Customer;

        return new UserProfile(user.Id, user.Email!, user.FullName, user.PhoneNumber, user.Address, user.ProfileImageUrl, role);
    }

    public async Task<bool> UpdateProfileAsync(string userId, string fullName, string? phoneNumber, string? address, string? profileImageUrl)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user is null)
        {
            return false;
        }

        user.FullName = fullName;
        user.PhoneNumber = phoneNumber;
        user.Address = address;
        user.ProfileImageUrl = profileImageUrl;

        var result = await _userManager.UpdateAsync(user);
        return result.Succeeded;
    }

    public async Task<int> GetCustomerCountAsync()
    {
        var customers = await _userManager.GetUsersInRoleAsync(Roles.Customer);
        return customers.Count;
    }
}
