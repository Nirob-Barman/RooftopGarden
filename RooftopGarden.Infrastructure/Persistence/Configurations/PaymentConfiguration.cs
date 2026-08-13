using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RooftopGarden.Domain.Entities;

namespace RooftopGarden.Infrastructure.Persistence.Configurations;

public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
{
    public void Configure(EntityTypeBuilder<Payment> builder)
    {
        builder.HasKey(p => p.Id);

        builder.Property(p => p.CustomerId)
            .IsRequired()
            .HasMaxLength(450);

        builder.Property(p => p.Amount)
            .HasColumnType("decimal(18,2)");

        builder.Property(p => p.PaymentMethod)
            .HasConversion<string>()
            .HasMaxLength(30);

        builder.Property(p => p.PaymentStatus)
            .HasConversion<string>()
            .HasMaxLength(30);

        builder.Property(p => p.TransactionId)
            .HasMaxLength(200);

        builder.HasIndex(p => p.CustomerId);

        builder.HasIndex(p => p.TransactionId)
            .IsUnique()
            .HasFilter("[TransactionId] IS NOT NULL");

        // The Order <-> Payment 1-to-1 relationship (including the unique FK on OrderId)
        // is configured from the Order side in OrderConfiguration.
    }
}
