namespace RooftopGarden.Application.Features.Carts.Dtos;

public record CartDto(int Id, List<CartItemDto> Items, decimal TotalAmount)
{
    public static CartDto Empty => new(0, new List<CartItemDto>(), 0);
}
