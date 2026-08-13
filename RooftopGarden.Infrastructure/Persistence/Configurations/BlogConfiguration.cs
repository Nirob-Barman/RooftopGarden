using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RooftopGarden.Domain.Entities;
using RooftopGarden.Infrastructure.Identity;

namespace RooftopGarden.Infrastructure.Persistence.Configurations;

public class BlogConfiguration : IEntityTypeConfiguration<Blog>
{
    public void Configure(EntityTypeBuilder<Blog> builder)
    {
        builder.HasKey(b => b.Id);

        builder.Property(b => b.Title)
            .IsRequired()
            .HasMaxLength(300);

        builder.Property(b => b.Content)
            .IsRequired();

        builder.Property(b => b.ImageUrl)
            .HasMaxLength(500);

        builder.Property(b => b.AuthorId)
            .IsRequired()
            .HasMaxLength(450);

        builder.HasIndex(b => b.AuthorId);

        builder.HasOne<ApplicationUser>()
            .WithMany()
            .HasForeignKey(b => b.AuthorId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
