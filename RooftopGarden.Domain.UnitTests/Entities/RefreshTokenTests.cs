using FluentAssertions;
using RooftopGarden.Domain.Entities;

namespace RooftopGarden.Domain.UnitTests.Entities
{
    public class RefreshTokenTests
    {
        [Fact]
        public void Constructor_WithValidValues_CreatesRefreshToken()
        {
            // Arrange
            var expiresAt = DateTime.UtcNow.AddDays(7);

            // Act
            var token = new RefreshToken(
                "user-123",
                "token-hash",
                expiresAt);

            // Assert
            token.UserId.Should().Be("user-123");
            token.TokenHash.Should().Be("token-hash");
            token.ExpiresAt.Should().Be(expiresAt);
            token.RevokedAt.Should().BeNull();
            token.ReplacedByTokenHash.Should().BeNull();
            token.IsExpired.Should().BeFalse();
            token.IsRevoked.Should().BeFalse();
            token.IsActive.Should().BeTrue();
        }

        [Fact]
        public void Constructor_WithEmptyUserId_ThrowsArgumentException()
        {
            var action = () => new RefreshToken(
                string.Empty,
                "token-hash",
                DateTime.UtcNow.AddDays(7));

            action.Should()
                .Throw<ArgumentException>()
                .WithMessage("UserId is required.*");
        }

        [Fact]
        public void Constructor_WithWhitespaceUserId_ThrowsArgumentException()
        {
            var action = () => new RefreshToken(
                "   ",
                "token-hash",
                DateTime.UtcNow.AddDays(7));

            action.Should()
                .Throw<ArgumentException>()
                .WithMessage("UserId is required.*");
        }

        [Fact]
        public void Constructor_WithEmptyTokenHash_ThrowsArgumentException()
        {
            var action = () => new RefreshToken(
                "user-123",
                string.Empty,
                DateTime.UtcNow.AddDays(7));

            action.Should()
                .Throw<ArgumentException>()
                .WithMessage("TokenHash is required.*");
        }

        [Fact]
        public void Constructor_WithWhitespaceTokenHash_ThrowsArgumentException()
        {
            var action = () => new RefreshToken(
                "user-123",
                "   ",
                DateTime.UtcNow.AddDays(7));

            action.Should()
                .Throw<ArgumentException>()
                .WithMessage("TokenHash is required.*");
        }

        [Fact]
        public void ExpiredToken_IsExpiredAndInactive()
        {
            // Arrange
            var token = new RefreshToken(
                "user-123",
                "token-hash",
                DateTime.UtcNow.AddSeconds(-1));

            // Assert
            token.IsExpired.Should().BeTrue();
            token.IsRevoked.Should().BeFalse();
            token.IsActive.Should().BeFalse();
        }

        [Fact]
        public void Revoke_SetsRevokedAtAndMakesTokenInactive()
        {
            // Arrange
            var token = new RefreshToken(
                "user-123",
                "token-hash",
                DateTime.UtcNow.AddDays(7));

            // Act
            token.Revoke();

            // Assert
            token.RevokedAt.Should().NotBeNull();
            token.IsRevoked.Should().BeTrue();
            token.IsActive.Should().BeFalse();
        }

        [Fact]
        public void Revoke_WithReplacementToken_StoresReplacementHash()
        {
            // Arrange
            var token = new RefreshToken(
                "user-123",
                "old-token",
                DateTime.UtcNow.AddDays(7));

            // Act
            token.Revoke("new-token");

            // Assert
            token.ReplacedByTokenHash.Should().Be("new-token");
            token.IsRevoked.Should().BeTrue();
        }

        [Fact]
        public void Revoke_WhenAlreadyRevoked_ThrowsInvalidOperationException()
        {
            // Arrange
            var token = new RefreshToken(
                "user-123",
                "token-hash",
                DateTime.UtcNow.AddDays(7));

            token.Revoke();

            // Act
            var action = () => token.Revoke();

            // Assert
            action.Should()
                .Throw<InvalidOperationException>()
                .WithMessage("This refresh token has already been revoked.");
        }

        [Fact]
        public void ActiveToken_IsNotExpiredAndNotRevoked()
        {
            // Arrange
            var token = new RefreshToken(
                "user-123",
                "token-hash",
                DateTime.UtcNow.AddDays(7));

            // Assert
            token.IsExpired.Should().BeFalse();
            token.IsRevoked.Should().BeFalse();
            token.IsActive.Should().BeTrue();
        }
    }
}
