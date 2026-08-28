using RooftopGarden.Domain.Enums;

namespace RooftopGarden.Api.Models.Products
{
    public sealed class UpdateProductRequest
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }

        public IFormFile? Image { get; set; }

        public int CategoryId { get; set; }
        public PlantType PlantType { get; set; }
        public SunlightRequirement SunlightRequirement { get; set; }
        public WaterRequirement WaterRequirement { get; set; }
    }

}
