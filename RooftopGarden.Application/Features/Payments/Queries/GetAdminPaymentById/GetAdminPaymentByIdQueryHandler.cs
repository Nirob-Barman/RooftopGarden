using MediatR;
using Microsoft.EntityFrameworkCore;
using RooftopGarden.Application.Common.Exceptions;
using RooftopGarden.Application.Common.Interfaces;
using RooftopGarden.Application.Features.Payments.Dtos;

namespace RooftopGarden.Application.Features.Payments.Queries.GetAdminPaymentById;

public class GetAdminPaymentByIdQueryHandler : IRequestHandler<GetAdminPaymentByIdQuery, PaymentDto>
{
    private readonly IApplicationDbContext _dbContext;

    public GetAdminPaymentByIdQueryHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PaymentDto> Handle(GetAdminPaymentByIdQuery request, CancellationToken cancellationToken)
    {
        var payment = await _dbContext.Payments.FirstOrDefaultAsync(p => p.Id == request.PaymentId, cancellationToken)
            ?? throw new NotFoundException("Payment", request.PaymentId);

        return payment.ToDto();
    }
}
