using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RooftopGarden.Domain.Entities;
using RooftopGarden.Infrastructure.Identity;

namespace RooftopGarden.Infrastructure.Persistence.Configurations;

public class ReviewConfiguration : IEntityTypeConfiguration<Review>
{
    public void Configure(EntityTypeBuilder<Review> builder)
    {
        builder.HasKey(r => r.Id);

        builder.Property(r => r.CustomerId)
            .IsRequired()
            .HasMaxLength(450);

        builder.Property(r => r.Comment)
            .HasMaxLength(2000);

        builder.HasIndex(r => r.ProductId);
        builder.HasIndex(r => r.CustomerId);

        builder.HasOne<ApplicationUser>()
            .WithMany()
            .HasForeignKey(r => r.CustomerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.ToTable(t => t.HasCheckConstraint("CK_Review_Rating_Range", "[Rating] >= 1 AND [Rating] <= 5"));
    }
}
