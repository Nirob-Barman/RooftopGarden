using RooftopGarden.Domain.Entities;

namespace RooftopGarden.Application.Features.Services.Dtos;

public static class ServiceDtoExtensions
{
    public static ServiceDto ToDto(this Service service) => new(
        service.Id,
        service.Name,
        service.Description,
        service.Price,
        service.Duration,
        service.ImageUrl,
        service.IsActive);
}
