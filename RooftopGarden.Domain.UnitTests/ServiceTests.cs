using FluentAssertions;
using RooftopGarden.Domain.Entities;

namespace RooftopGarden.Domain.UnitTests
{
    public class ServiceTests
    {
        [Fact]
        public void Constructor_WithValidValues_CreatesService()
        {
            // Arrange
            const string name = "Garden Maintenance";
            const decimal price = 100m;
            var duration = TimeSpan.FromHours(2);

            // Act
            var service = new Service(
                name,
                price,
                duration,
                "Regular garden maintenance",
                "image.jpg");

            // Assert
            service.Name.Should().Be(name);
            service.Price.Should().Be(price);
            service.Duration.Should().Be(duration);
            service.Description.Should().Be("Regular garden maintenance");
            service.ImageUrl.Should().Be("image.jpg");
            service.IsActive.Should().BeTrue();
            service.Bookings.Should().BeEmpty();
        }

        [Fact]
        public void Constructor_WithEmptyName_ThrowsArgumentException()
        {
            // Act
            var action = () => new Service(
                string.Empty,
                100m,
                TimeSpan.FromHours(1));

            // Assert
            action.Should()
                .Throw<ArgumentException>()
                .WithMessage("Service name is required.*");
        }

        [Fact]
        public void Constructor_WithWhitespaceName_ThrowsArgumentException()
        {
            // Act
            var action = () => new Service(
                "   ",
                100m,
                TimeSpan.FromHours(1));

            // Assert
            action.Should()
                .Throw<ArgumentException>()
                .WithMessage("Service name is required.*");
        }

        [Fact]
        public void Constructor_WithNegativePrice_ThrowsArgumentException()
        {
            // Act
            var action = () => new Service(
                "Garden Maintenance",
                -1m,
                TimeSpan.FromHours(1));

            // Assert
            action.Should()
                .Throw<ArgumentException>()
                .WithMessage("Price cannot be negative.*");
        }

        [Fact]
        public void Constructor_WithZeroPrice_CreatesService()
        {
            // Act
            var service = new Service(
                "Free Consultation",
                0m,
                TimeSpan.FromHours(1));

            // Assert
            service.Price.Should().Be(0m);
        }

        [Fact]
        public void UpdateDetails_WithValidValues_UpdatesService()
        {
            // Arrange
            var service = new Service(
                "Garden Maintenance",
                100m,
                TimeSpan.FromHours(1),
                "Old description",
                "old.jpg");

            var newDuration = TimeSpan.FromHours(3);

            // Act
            service.UpdateDetails(
                "Garden Design",
                250m,
                newDuration,
                "New description",
                "new.jpg");

            // Assert
            service.Name.Should().Be("Garden Design");
            service.Price.Should().Be(250m);
            service.Duration.Should().Be(newDuration);
            service.Description.Should().Be("New description");
            service.ImageUrl.Should().Be("new.jpg");
        }

        [Fact]
        public void UpdateDetails_WithEmptyName_ThrowsArgumentException()
        {
            // Arrange
            var service = new Service(
                "Garden Maintenance",
                100m,
                TimeSpan.FromHours(1));

            // Act
            var action = () => service.UpdateDetails(
                string.Empty,
                200m,
                TimeSpan.FromHours(2),
                null,
                null);

            // Assert
            action.Should()
                .Throw<ArgumentException>()
                .WithMessage("Service name is required.*");
        }

        [Fact]
        public void UpdateDetails_WithNegativePrice_ThrowsArgumentException()
        {
            // Arrange
            var service = new Service(
                "Garden Maintenance",
                100m,
                TimeSpan.FromHours(1));

            // Act
            var action = () => service.UpdateDetails(
                "Garden Design",
                -50m,
                TimeSpan.FromHours(2),
                null,
                null);

            // Assert
            action.Should()
                .Throw<ArgumentException>()
                .WithMessage("Price cannot be negative.*");
        }

        [Fact]
        public void Deactivate_SetsIsActiveToFalse()
        {
            // Arrange
            var service = new Service(
                "Garden Maintenance",
                100m,
                TimeSpan.FromHours(1));

            // Act
            service.Deactivate();

            // Assert
            service.IsActive.Should().BeFalse();
        }

        [Fact]
        public void Activate_SetsIsActiveToTrue()
        {
            // Arrange
            var service = new Service(
                "Garden Maintenance",
                100m,
                TimeSpan.FromHours(1));

            service.Deactivate();

            // Act
            service.Activate();

            // Assert
            service.IsActive.Should().BeTrue();
        }
    }
}
