using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RooftopGarden.Domain.Entities;
using RooftopGarden.Infrastructure.Identity;

namespace RooftopGarden.Infrastructure.Persistence.Configurations;

public class RefreshTokenConfiguration : IEntityTypeConfiguration<RefreshToken>
{
    public void Configure(EntityTypeBuilder<RefreshToken> builder)
    {
        builder.HasKey(t => t.Id);

        builder.Property(t => t.UserId)
            .IsRequired()
            .HasMaxLength(450);

        builder.Property(t => t.TokenHash)
            .IsRequired()
            .HasMaxLength(128);

        builder.Property(t => t.ReplacedByTokenHash)
            .HasMaxLength(128);

        builder.HasIndex(t => t.TokenHash).IsUnique();
        builder.HasIndex(t => t.UserId);

        builder.HasOne<ApplicationUser>()
            .WithMany()
            .HasForeignKey(t => t.UserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
