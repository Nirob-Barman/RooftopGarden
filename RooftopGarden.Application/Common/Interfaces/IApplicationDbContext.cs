using Microsoft.EntityFrameworkCore;
using RooftopGarden.Domain.Entities;

namespace RooftopGarden.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Category> Categories { get; }
    DbSet<Product> Products { get; }
    DbSet<Cart> Carts { get; }
    DbSet<CartItem> CartItems { get; }
    DbSet<Order> Orders { get; }
    DbSet<OrderItem> OrderItems { get; }
    DbSet<Payment> Payments { get; }
    DbSet<Review> Reviews { get; }
    DbSet<Service> Services { get; }
    DbSet<Booking> Bookings { get; }
    DbSet<Wishlist> Wishlists { get; }
    DbSet<Blog> Blogs { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
