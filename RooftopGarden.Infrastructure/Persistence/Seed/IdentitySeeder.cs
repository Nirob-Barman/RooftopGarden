using System.Security.Cryptography;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using RooftopGarden.Infrastructure.Identity;

namespace RooftopGarden.Infrastructure.Persistence.Seed;

public static class IdentitySeeder
{
    public const string AdminRole = "Admin";
    public const string CustomerRole = "Customer";

    private const string AdminEmail = "admin@rooftopgarden.com";

    public static async Task SeedAsync(IServiceProvider services)
    {
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
        var logger = services.GetRequiredService<ILoggerFactory>().CreateLogger("IdentitySeeder");

        foreach (var roleName in new[] { AdminRole, CustomerRole })
        {
            if (!await roleManager.RoleExistsAsync(roleName))
            {
                await roleManager.CreateAsync(new IdentityRole(roleName));
            }
        }

        if (await userManager.FindByEmailAsync(AdminEmail) is not null)
        {
            return;
        }

        var admin = new ApplicationUser
        {
            UserName = AdminEmail,
            Email = AdminEmail,
            FullName = "RooftopGarden Admin",
            EmailConfirmed = true
        };

        var password = GenerateStrongPassword();
        var result = await userManager.CreateAsync(admin, password);

        if (!result.Succeeded)
        {
            logger.LogError(
                "Failed to seed the initial admin user: {Errors}",
                string.Join("; ", result.Errors.Select(e => e.Description)));
            return;
        }

        await userManager.AddToRoleAsync(admin, AdminRole);

        logger.LogWarning(
            "Seeded initial admin user {Email} with password: {Password} — change this after first login. " +
            "This message only appears once and the password is not stored anywhere.",
            AdminEmail,
            password);
    }

    private static string GenerateStrongPassword()
    {
        const string upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
        const string lower = "abcdefghijkmnopqrstuvwxyz";
        const string digits = "23456789";
        const string all = upper + lower + digits;
        const int length = 16;

        var bytes = new byte[length];
        RandomNumberGenerator.Fill(bytes);

        var chars = new char[length];
        for (var i = 0; i < length; i++)
        {
            chars[i] = all[bytes[i] % all.Length];
        }

        chars[0] = upper[bytes[0] % upper.Length];
        chars[1] = lower[bytes[1] % lower.Length];
        chars[2] = digits[bytes[2] % digits.Length];

        return new string(chars);
    }
}
