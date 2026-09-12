using FluentAssertions;
using Moq;
using Moq.EntityFrameworkCore;
using RooftopGarden.Application.Common.Exceptions;
using RooftopGarden.Application.Common.Interfaces;
using RooftopGarden.Application.Features.Categories.Queries.GetCategoryById;
using RooftopGarden.Domain.Entities;

namespace RooftopGarden.Application.UnitTests.Features.Categories.Queries.GetCategoryById
{
    public class GetCategoryByIdQueryHandlerTests
    {
        private readonly Mock<IApplicationDbContext> _contextMock;
        private readonly GetCategoryByIdQueryHandler _handler;

        public GetCategoryByIdQueryHandlerTests()
        {
            _contextMock = new Mock<IApplicationDbContext>();

            _handler = new GetCategoryByIdQueryHandler(
                _contextMock.Object);
        }

        [Fact]
        public async Task Should_Return_Category_When_Category_Exists()
        {
            // Arrange
            var category = new Category(
                "Vegetables",
                "Fresh vegetables")
            {
                Id = 1
            };

            var categories = new List<Category>
            {
                category
            };

            _contextMock
                .Setup(x => x.Categories)
                .ReturnsDbSet(categories);

            var query = new GetCategoryByIdQuery(1);

            // Act
            var result = await _handler.Handle(
                query,
                CancellationToken.None);

            // Assert
            result.Should().NotBeNull();
            result.Id.Should().Be(1);
            result.Name.Should().Be("Vegetables");
            result.Description.Should().Be("Fresh vegetables");
        }

        [Fact]
        public async Task Should_Throw_NotFoundException_When_Category_Does_Not_Exist_With_Expected_Message()
        {
            // Arrange
            var categories = new List<Category>
            {
                new Category(
                    "Vegetables",
                    "Fresh vegetables")
                {
                    Id = 1
                }
            };

            _contextMock
                .Setup(x => x.Categories)
                .ReturnsDbSet(categories);

            var query = new GetCategoryByIdQuery(999);

            // Act
            var act = () => _handler.Handle(
                query,
                CancellationToken.None);

            // Assert
            await act.Should()
                .ThrowAsync<NotFoundException>()
                .WithMessage("*999*");
        }


        [Fact]
        public async Task Should_Return_Correct_Category_When_Multiple_Categories_Exist()
        {
            // Arrange
            var categories = new List<Category>
            {
                new Category(
                    "Vegetables",
                    "Fresh vegetables")
                {
                    Id = 1
                },
                new Category(
                    "Fruits",
                    "Fresh fruits")
                {
                    Id = 2
                },
                new Category(
                    "Flowers",
                    "Beautiful flowers")
                {
                    Id = 3
                }
            };

            _contextMock
                .Setup(x => x.Categories)
                .ReturnsDbSet(categories);

            var query = new GetCategoryByIdQuery(2);

            // Act
            var result = await _handler.Handle(
                query,
                CancellationToken.None);

            // Assert
            result.Should().NotBeNull();
            result.Id.Should().Be(2);
            result.Name.Should().Be("Fruits");
            result.Description.Should().Be("Fresh fruits");
        }
    }
}
