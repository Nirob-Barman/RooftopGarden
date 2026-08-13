using Microsoft.EntityFrameworkCore;
using RooftopGarden.Application.Common.Interfaces;
using RooftopGarden.Application.Features.Carts.Dtos;

namespace RooftopGarden.Application.Features.Carts;

internal static class CartLoader
{
    public static async Task<CartDto> LoadAsync(IApplicationDbContext dbContext, string customerId, CancellationToken cancellationToken)
    {
        var cart = await dbContext.Carts
            .Include(c => c.CartItems).ThenInclude(ci => ci.Product)
            .FirstOrDefaultAsync(c => c.CustomerId == customerId, cancellationToken);

        return cart?.ToDto() ?? CartDto.Empty;
    }
}
