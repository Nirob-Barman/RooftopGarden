using FluentAssertions;
using RooftopGarden.Domain.Entities;

namespace RooftopGarden.Domain.UnitTests.Entities
{
    public class CartTests
    {
        [Fact]
        public void Constructor_WithValidCustomerId_CreatesCart()
        {
            // Arrange
            const string customerId = "customer-123";

            // Act
            var cart = new Cart(customerId);

            // Assert
            cart.CustomerId.Should().Be(customerId);
            cart.CartItems.Should().BeEmpty();
            cart.CreatedAt.Should().BeCloseTo(
                DateTime.UtcNow,
                TimeSpan.FromSeconds(2));
            cart.UpdatedAt.Should().BeNull();
        }

        [Fact]
        public void Constructor_WithEmptyCustomerId_ThrowsArgumentException()
        {
            // Act
            var action = () => new Cart(string.Empty);

            // Assert
            action.Should()
                .Throw<ArgumentException>()
                .WithMessage("CustomerId is required.*");
        }

        [Fact]
        public void Constructor_WithWhitespaceCustomerId_ThrowsArgumentException()
        {
            // Act
            var action = () => new Cart("   ");

            // Assert
            action.Should()
                .Throw<ArgumentException>()
                .WithMessage("CustomerId is required.*");
        }

        [Fact]
        public void AddOrUpdateItem_WithValidQuantity_AddsNewItem()
        {
            // Arrange
            var cart = new Cart("customer-123");

            // Act
            var item = cart.AddOrUpdateItem(10, 2);

            // Assert
            item.ProductId.Should().Be(10);
            item.Quantity.Should().Be(2);
            cart.CartItems.Should().ContainSingle();
            cart.CartItems.Single().Should().BeSameAs(item);
            cart.UpdatedAt.Should().NotBeNull();
        }

        [Fact]
        public void AddOrUpdateItem_WithZeroQuantity_ThrowsArgumentException()
        {
            // Arrange
            var cart = new Cart("customer-123");

            // Act
            var action = () => cart.AddOrUpdateItem(10, 0);

            // Assert
            action.Should()
                .Throw<ArgumentException>()
                .WithMessage("Quantity must be positive.*");
        }

        [Fact]
        public void AddOrUpdateItem_WithNegativeQuantity_ThrowsArgumentException()
        {
            // Arrange
            var cart = new Cart("customer-123");

            // Act
            var action = () => cart.AddOrUpdateItem(10, -1);

            // Assert
            action.Should()
                .Throw<ArgumentException>()
                .WithMessage("Quantity must be positive.*");
        }

        [Fact]
        public void AddOrUpdateItem_WithExistingProduct_IncreasesQuantity()
        {
            // Arrange
            var cart = new Cart("customer-123");

            var firstItem = cart.AddOrUpdateItem(10, 2);

            // Act
            var secondItem = cart.AddOrUpdateItem(10, 3);

            // Assert
            secondItem.Should().BeSameAs(firstItem);
            secondItem.Quantity.Should().Be(5);
            cart.CartItems.Should().ContainSingle();
        }

        [Fact]
        public void UpdateItemQuantity_WithExistingItem_UpdatesQuantity()
        {
            // Arrange
            var cart = new Cart("customer-123");
            var item = cart.AddOrUpdateItem(10, 2);

            // Act
            cart.UpdateItemQuantity(item.Id, 5);

            // Assert
            item.Quantity.Should().Be(5);
            cart.CartItems.Should().ContainSingle();
            cart.UpdatedAt.Should().NotBeNull();
        }

        [Fact]
        public void UpdateItemQuantity_WithZeroQuantity_RemovesItem()
        {
            // Arrange
            var cart = new Cart("customer-123");
            var item = cart.AddOrUpdateItem(10, 2);

            // Act
            cart.UpdateItemQuantity(item.Id, 0);

            // Assert
            cart.CartItems.Should().BeEmpty();
            cart.UpdatedAt.Should().NotBeNull();
        }

        [Fact]
        public void UpdateItemQuantity_WithNegativeQuantity_RemovesItem()
        {
            // Arrange
            var cart = new Cart("customer-123");
            var item = cart.AddOrUpdateItem(10, 2);

            // Act
            cart.UpdateItemQuantity(item.Id, -1);

            // Assert
            cart.CartItems.Should().BeEmpty();
            cart.UpdatedAt.Should().NotBeNull();
        }

        [Fact]
        public void UpdateItemQuantity_WithNonExistingItem_ThrowsInvalidOperationException()
        {
            // Arrange
            var cart = new Cart("customer-123");

            // Act
            var action = () => cart.UpdateItemQuantity(999, 5);

            // Assert
            action.Should()
                .Throw<InvalidOperationException>()
                .WithMessage("Cart item not found.");
        }

        [Fact]
        public void RemoveItem_WithExistingItem_RemovesItem()
        {
            // Arrange
            var cart = new Cart("customer-123");
            var item = cart.AddOrUpdateItem(10, 2);

            // Act
            cart.RemoveItem(item.Id);

            // Assert
            cart.CartItems.Should().BeEmpty();
            cart.UpdatedAt.Should().NotBeNull();
        }

        [Fact]
        public void RemoveItem_WithNonExistingItem_DoesNothing()
        {
            // Arrange
            var cart = new Cart("customer-123");
            var createdAt = cart.CreatedAt;

            // Act
            cart.RemoveItem(999);

            // Assert
            cart.CartItems.Should().BeEmpty();
            cart.CreatedAt.Should().Be(createdAt);
            cart.UpdatedAt.Should().BeNull();
        }

        [Fact]
        public void Clear_WithItems_RemovesAllItems()
        {
            // Arrange
            var cart = new Cart("customer-123");

            cart.AddOrUpdateItem(10, 2);
            cart.AddOrUpdateItem(20, 3);

            // Act
            cart.Clear();

            // Assert
            cart.CartItems.Should().BeEmpty();
            cart.UpdatedAt.Should().NotBeNull();
        }

        [Fact]
        public void Clear_WhenCartIsEmpty_SetsUpdatedAt()
        {
            // Arrange
            var cart = new Cart("customer-123");

            // Act
            cart.Clear();

            // Assert
            cart.CartItems.Should().BeEmpty();
            cart.UpdatedAt.Should().NotBeNull();
        }
    }
}
