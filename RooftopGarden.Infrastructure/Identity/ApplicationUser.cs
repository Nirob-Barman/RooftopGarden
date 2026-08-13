using Microsoft.AspNetCore.Identity;

namespace RooftopGarden.Infrastructure.Identity;

public class ApplicationUser : IdentityUser
{
    public string FullName { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string? ProfileImageUrl { get; set; }
}
