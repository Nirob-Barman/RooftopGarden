using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using RooftopGarden.Application.Common.Interfaces;
using RooftopGarden.Application.Common.Models.Identity;
using RooftopGarden.Domain.Entities;
using RooftopGarden.Infrastructure.Persistence;

namespace RooftopGarden.Infrastructure.Authentication;

public class RefreshTokenService : IRefreshTokenService
{
    private static readonly TimeSpan Lifetime = TimeSpan.FromDays(7);

    private readonly ApplicationDbContext _dbContext;

    public RefreshTokenService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IssuedRefreshToken> IssueAsync(string userId, CancellationToken cancellationToken)
    {
        var (rawToken, hash) = GenerateToken();
        var expiresAt = DateTime.UtcNow.Add(Lifetime);

        _dbContext.RefreshTokens.Add(new RefreshToken(userId, hash, expiresAt));
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new IssuedRefreshToken(rawToken, expiresAt);
    }

    public async Task<RefreshTokenResult> RotateAsync(string rawToken, CancellationToken cancellationToken)
    {
        var hash = Hash(rawToken);
        var existing = await _dbContext.RefreshTokens.SingleOrDefaultAsync(t => t.TokenHash == hash, cancellationToken);

        if (existing is null || !existing.IsActive)
        {
            return new RefreshTokenResult(false, null, null, null);
        }

        var (newRawToken, newHash) = GenerateToken();
        var newExpiresAt = DateTime.UtcNow.Add(Lifetime);

        existing.Revoke(newHash);
        _dbContext.RefreshTokens.Add(new RefreshToken(existing.UserId, newHash, newExpiresAt));

        await _dbContext.SaveChangesAsync(cancellationToken);

        return new RefreshTokenResult(true, existing.UserId, newRawToken, newExpiresAt);
    }

    public async Task<bool> RevokeAsync(string rawToken, CancellationToken cancellationToken)
    {
        var hash = Hash(rawToken);
        var existing = await _dbContext.RefreshTokens.SingleOrDefaultAsync(t => t.TokenHash == hash, cancellationToken);

        if (existing is null || !existing.IsActive)
        {
            return false;
        }

        existing.Revoke();
        await _dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }

    private static (string RawToken, string Hash) GenerateToken()
    {
        var bytes = new byte[64];
        RandomNumberGenerator.Fill(bytes);
        var rawToken = Convert.ToBase64String(bytes);
        return (rawToken, Hash(rawToken));
    }

    private static string Hash(string rawToken)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(rawToken));
        return Convert.ToHexString(bytes);
    }
}
