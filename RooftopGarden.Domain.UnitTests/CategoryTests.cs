using FluentAssertions;
using RooftopGarden.Domain.Entities;

namespace RooftopGarden.Domain.UnitTests
{
    public class CategoryTests
    {
        [Fact]
        public void Constructor_WithValidName_CreatesCategory()
        {
            // Act
            var category = new Category("Vegetables", "Fresh vegetables");

            // Assert
            category.Name.Should().Be("Vegetables");
            category.Description.Should().Be("Fresh vegetables");
            category.Products.Should().BeEmpty();
        }

        [Fact]
        public void Constructor_WithEmptyName_ThrowsArgumentException()
        {
            // Act
            var action = () => new Category(string.Empty);

            // Assert
            action.Should()
                .Throw<ArgumentException>()
                .WithMessage("Category name is required.*");
        }

        [Fact]
        public void Constructor_WithWhitespaceName_ThrowsArgumentException()
        {
            // Act
            var action = () => new Category("   ");

            // Assert
            action.Should()
                .Throw<ArgumentException>()
                .WithMessage("Category name is required.*");
        }

        [Fact]
        public void Update_WithValidValues_UpdatesCategory()
        {
            // Arrange
            var category = new Category("Vegetables", "Fresh vegetables");

            // Act
            category.Update("Flowers", "Beautiful flowers");

            // Assert
            category.Name.Should().Be("Flowers");
            category.Description.Should().Be("Beautiful flowers");
        }

        [Fact]
        public void Update_WithEmptyName_ThrowsArgumentException()
        {
            // Arrange
            var category = new Category("Vegetables", "Fresh vegetables");

            // Act
            var action = () => category.Update(string.Empty, "Updated description");

            // Assert
            action.Should()
                .Throw<ArgumentException>()
                .WithMessage("Category name is required.*");
        }
    }
}
