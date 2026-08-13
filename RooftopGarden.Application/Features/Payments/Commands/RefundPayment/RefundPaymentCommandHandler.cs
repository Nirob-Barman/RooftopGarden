using MediatR;
using Microsoft.EntityFrameworkCore;
using RooftopGarden.Application.Common.Exceptions;
using RooftopGarden.Application.Common.Interfaces;
using RooftopGarden.Application.Features.Payments.Dtos;
using RooftopGarden.Domain.Enums;

namespace RooftopGarden.Application.Features.Payments.Commands.RefundPayment;

public class RefundPaymentCommandHandler : IRequestHandler<RefundPaymentCommand, PaymentDto>
{
    private readonly IApplicationDbContext _dbContext;

    public RefundPaymentCommandHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PaymentDto> Handle(RefundPaymentCommand request, CancellationToken cancellationToken)
    {
        var payment = await _dbContext.Payments.FirstOrDefaultAsync(p => p.Id == request.PaymentId, cancellationToken)
            ?? throw new NotFoundException("Payment", request.PaymentId);

        payment.Refund();

        var order = await _dbContext.Orders.FirstOrDefaultAsync(o => o.Id == payment.OrderId, cancellationToken);
        order?.MarkPaymentStatus(PaymentStatus.Refunded);

        await _dbContext.SaveChangesAsync(cancellationToken);

        return payment.ToDto();
    }
}
