using FluentAssertions;
using RooftopGarden.Domain.Entities;
using RooftopGarden.Domain.Enums;

namespace RooftopGarden.Domain.UnitTests
{
    public class ProductTests
    {
        private static Product CreateProduct(
            string name = "Rose",
            decimal price = 100m,
            int stockQuantity = 10,
            int categoryId = 1,
            PlantType plantType = default,
            SunlightRequirement sunlightRequirement = default,
            WaterRequirement waterRequirement = default,
            string? description = null,
            string? imageUrl = null)
        {
            return new Product(
                name,
                price,
                stockQuantity,
                categoryId,
                plantType,
                sunlightRequirement,
                waterRequirement,
                description,
                imageUrl);
        }

        [Fact]
        public void Constructor_WithValidData_CreatesProduct()
        {
            // Arrange
            var before = DateTime.UtcNow;

            // Act
            var product = CreateProduct(
                name: "Rose",
                price: 100m,
                stockQuantity: 10,
                categoryId: 2,
                description: "Beautiful rose",
                imageUrl: "rose.jpg");

            var after = DateTime.UtcNow;

            // Assert
            product.Name.Should().Be("Rose");
            product.Price.Should().Be(100m);
            product.StockQuantity.Should().Be(10);
            product.CategoryId.Should().Be(2);
            product.Description.Should().Be("Beautiful rose");
            product.ImageUrl.Should().Be("rose.jpg");
            product.IsActive.Should().BeTrue();
            product.CreatedAt.Should().BeOnOrAfter(before);
            product.CreatedAt.Should().BeOnOrBefore(after);
        }

        [Theory]
        [InlineData("")]
        [InlineData(" ")]
        [InlineData("   ")]
        public void Constructor_WithInvalidName_ThrowsArgumentException(string name)
        {
            // Act
            var action = () => CreateProduct(name: name);

            // Assert
            action.Should()
                .Throw<ArgumentException>()
                .WithMessage("Product name is required.*");
        }

        [Fact]
        public void Constructor_WithNegativePrice_ThrowsArgumentException()
        {
            // Act
            var action = () => CreateProduct(price: -1m);

            // Assert
            action.Should()
                .Throw<ArgumentException>()
                .WithMessage("Price cannot be negative.*");
        }

        [Fact]
        public void Constructor_WithNegativeStock_ThrowsArgumentException()
        {
            // Act
            var action = () => CreateProduct(stockQuantity: -1);

            // Assert
            action.Should()
                .Throw<ArgumentException>()
                .WithMessage("Stock quantity cannot be negative.*");
        }

        [Fact]
        public void Constructor_WithZeroPrice_CreatesProduct()
        {
            // Act
            var product = CreateProduct(price: 0m);

            // Assert
            product.Price.Should().Be(0m);
        }

        [Fact]
        public void UpdateDetails_WithValidData_UpdatesProduct()
        {
            // Arrange
            var product = CreateProduct();

            // Act
            product.UpdateDetails(
                "Updated Rose",
                150m,
                3,
                default,
                default,
                default,
                "Updated description",
                "updated.jpg");

            // Assert
            product.Name.Should().Be("Updated Rose");
            product.Price.Should().Be(150m);
            product.CategoryId.Should().Be(3);
            product.Description.Should().Be("Updated description");
            product.ImageUrl.Should().Be("updated.jpg");
            product.UpdatedAt.Should().NotBeNull();
        }

        [Fact]
        public void Deactivate_Product_BecomesInactive()
        {
            // Arrange
            var product = CreateProduct();

            // Act
            product.Deactivate();

            // Assert
            product.IsActive.Should().BeFalse();
            product.UpdatedAt.Should().NotBeNull();
        }

        [Fact]
        public void Activate_Product_BecomesActive()
        {
            // Arrange
            var product = CreateProduct();
            product.Deactivate();

            // Act
            product.Activate();

            // Assert
            product.IsActive.Should().BeTrue();
            product.UpdatedAt.Should().NotBeNull();
        }

        [Theory]
        [InlineData(10, 1, true)]
        [InlineData(10, 5, true)]
        [InlineData(10, 10, true)]
        [InlineData(10, 11, false)]
        [InlineData(10, 0, false)]
        [InlineData(10, -1, false)]
        public void CanBeOrdered_ReturnsExpectedResult(
            int stockQuantity,
            int requestedQuantity,
            bool expected)
        {
            // Arrange
            var product = CreateProduct(stockQuantity: stockQuantity);

            // Act
            var result = product.CanBeOrdered(requestedQuantity);

            // Assert
            result.Should().Be(expected);
        }

        [Fact]
        public void CanBeOrdered_WhenProductIsInactive_ReturnsFalse()
        {
            // Arrange
            var product = CreateProduct();
            product.Deactivate();

            // Act
            var result = product.CanBeOrdered(1);

            // Assert
            result.Should().BeFalse();
        }

        [Fact]
        public void DecreaseStock_WithValidQuantity_DecreasesStock()
        {
            // Arrange
            var product = CreateProduct(stockQuantity: 10);

            // Act
            product.DecreaseStock(3);

            // Assert
            product.StockQuantity.Should().Be(7);
            product.UpdatedAt.Should().NotBeNull();
        }

        [Theory]
        [InlineData(0)]
        [InlineData(-1)]
        [InlineData(-10)]
        public void DecreaseStock_WithInvalidQuantity_ThrowsArgumentException(
            int quantity)
        {
            // Arrange
            var product = CreateProduct(stockQuantity: 10);

            // Act
            var action = () => product.DecreaseStock(quantity);

            // Assert
            action.Should()
                .Throw<ArgumentException>()
                .WithMessage("Quantity must be positive.*");
        }

        [Fact]
        public void DecreaseStock_WhenInsufficientStock_ThrowsInvalidOperationException()
        {
            // Arrange
            var product = CreateProduct(stockQuantity: 5);

            // Act
            var action = () => product.DecreaseStock(6);

            // Assert
            action.Should()
                .Throw<InvalidOperationException>()
                .WithMessage("Insufficient stock.");

            product.StockQuantity.Should().Be(5);
        }

        [Fact]
        public void IncreaseStock_WithValidQuantity_IncreasesStock()
        {
            // Arrange
            var product = CreateProduct(stockQuantity: 10);

            // Act
            product.IncreaseStock(5);

            // Assert
            product.StockQuantity.Should().Be(15);
            product.UpdatedAt.Should().NotBeNull();
        }

        [Theory]
        [InlineData(0)]
        [InlineData(-1)]
        [InlineData(-10)]
        public void IncreaseStock_WithInvalidQuantity_ThrowsArgumentException(
            int quantity)
        {
            // Arrange
            var product = CreateProduct(stockQuantity: 10);

            // Act
            var action = () => product.IncreaseStock(quantity);

            // Assert
            action.Should()
                .Throw<ArgumentException>()
                .WithMessage("Quantity must be positive.*");
        }

        [Fact]
        public void AdjustStockTo_WithValidQuantity_UpdatesStock()
        {
            // Arrange
            var product = CreateProduct(stockQuantity: 10);

            // Act
            product.AdjustStockTo(25);

            // Assert
            product.StockQuantity.Should().Be(25);
            product.UpdatedAt.Should().NotBeNull();
        }

        [Fact]
        public void AdjustStockTo_WithZero_SetsStockToZero()
        {
            // Arrange
            var product = CreateProduct(stockQuantity: 10);

            // Act
            product.AdjustStockTo(0);

            // Assert
            product.StockQuantity.Should().Be(0);
        }

        [Fact]
        public void AdjustStockTo_WithNegativeQuantity_ThrowsArgumentException()
        {
            // Arrange
            var product = CreateProduct(stockQuantity: 10);

            // Act
            var action = () => product.AdjustStockTo(-1);

            // Assert
            action.Should()
                .Throw<ArgumentException>()
                .WithMessage("Stock quantity cannot be negative.*");
        }
    }
}
