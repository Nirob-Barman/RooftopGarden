using MediatR;
using Microsoft.EntityFrameworkCore;
using RooftopGarden.Application.Common.Exceptions;
using RooftopGarden.Application.Common.Interfaces;
using RooftopGarden.Application.Features.Services.Dtos;

namespace RooftopGarden.Application.Features.Services.Queries.GetServiceById;

public class GetServiceByIdQueryHandler : IRequestHandler<GetServiceByIdQuery, ServiceDto>
{
    private readonly IApplicationDbContext _dbContext;

    public GetServiceByIdQueryHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ServiceDto> Handle(GetServiceByIdQuery request, CancellationToken cancellationToken)
    {
        var service = await _dbContext.Services.FirstOrDefaultAsync(s => s.Id == request.Id, cancellationToken);

        if (service is null || (!request.IncludeInactive && !service.IsActive))
        {
            throw new NotFoundException("Service", request.Id);
        }

        return service.ToDto();
    }
}
