using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RooftopGarden.Domain.Entities;
using RooftopGarden.Infrastructure.Identity;

namespace RooftopGarden.Infrastructure.Persistence.Configurations;

public class BookingConfiguration : IEntityTypeConfiguration<Booking>
{
    public void Configure(EntityTypeBuilder<Booking> builder)
    {
        builder.HasKey(b => b.Id);

        builder.Property(b => b.CustomerId)
            .IsRequired()
            .HasMaxLength(450);

        builder.HasOne<ApplicationUser>()
            .WithMany()
            .HasForeignKey(b => b.CustomerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Property(b => b.Address)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(b => b.Notes)
            .HasMaxLength(1000);

        builder.Property(b => b.Status)
            .HasConversion<string>()
            .HasMaxLength(30);

        builder.HasIndex(b => b.CustomerId);
        builder.HasIndex(b => b.ServiceId);
    }
}
