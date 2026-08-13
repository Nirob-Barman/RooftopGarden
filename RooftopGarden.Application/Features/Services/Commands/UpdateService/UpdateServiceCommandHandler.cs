using MediatR;
using Microsoft.EntityFrameworkCore;
using RooftopGarden.Application.Common.Exceptions;
using RooftopGarden.Application.Common.Interfaces;
using RooftopGarden.Application.Features.Services.Dtos;

namespace RooftopGarden.Application.Features.Services.Commands.UpdateService;

public class UpdateServiceCommandHandler : IRequestHandler<UpdateServiceCommand, ServiceDto>
{
    private readonly IApplicationDbContext _dbContext;

    public UpdateServiceCommandHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ServiceDto> Handle(UpdateServiceCommand request, CancellationToken cancellationToken)
    {
        var service = await _dbContext.Services.FirstOrDefaultAsync(s => s.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException("Service", request.Id);

        service.UpdateDetails(request.Name, request.Price, request.Duration, request.Description, request.ImageUrl);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return service.ToDto();
    }
}
