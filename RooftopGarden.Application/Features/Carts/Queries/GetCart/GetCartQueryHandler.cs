using MediatR;
using RooftopGarden.Application.Common.Interfaces;
using RooftopGarden.Application.Features.Carts.Dtos;

namespace RooftopGarden.Application.Features.Carts.Queries.GetCart;

public class GetCartQueryHandler : IRequestHandler<GetCartQuery, CartDto>
{
    private readonly IApplicationDbContext _dbContext;

    public GetCartQueryHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<CartDto> Handle(GetCartQuery request, CancellationToken cancellationToken) =>
        CartLoader.LoadAsync(_dbContext, request.CustomerId, cancellationToken);
}
