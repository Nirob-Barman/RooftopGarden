using MediatR;
using RooftopGarden.Application.Common.Interfaces;
using RooftopGarden.Application.Features.Services.Dtos;
using RooftopGarden.Domain.Entities;

namespace RooftopGarden.Application.Features.Services.Commands.CreateService;

public class CreateServiceCommandHandler : IRequestHandler<CreateServiceCommand, ServiceDto>
{
    private readonly IApplicationDbContext _dbContext;

    public CreateServiceCommandHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ServiceDto> Handle(CreateServiceCommand request, CancellationToken cancellationToken)
    {
        var service = new Service(request.Name, request.Price, request.Duration, request.Description, request.ImageUrl);

        _dbContext.Services.Add(service);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return service.ToDto();
    }
}
