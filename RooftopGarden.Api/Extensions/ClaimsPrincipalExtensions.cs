using System.Security.Claims;

namespace RooftopGarden.Api.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static string GetUserId(this ClaimsPrincipal user)
    {
        return user.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new InvalidOperationException("User id claim was not found on the current principal.");
    }
}
