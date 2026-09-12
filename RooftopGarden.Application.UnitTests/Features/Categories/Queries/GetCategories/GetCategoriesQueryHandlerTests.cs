using FluentAssertions;
using Moq;
using Moq.EntityFrameworkCore;
using RooftopGarden.Application.Common.Interfaces;
using RooftopGarden.Application.Features.Categories.Dtos;
using RooftopGarden.Application.Features.Categories.Queries.GetCategories;
using RooftopGarden.Domain.Entities;

namespace RooftopGarden.Application.UnitTests.Features.Categories.Queries.GetCategories
{
    public class GetCategoriesQueryHandlerTests
    {
        private readonly Mock<IApplicationDbContext> _contextMock;
        private readonly GetCategoriesQueryHandler _handler;

        public GetCategoriesQueryHandlerTests()
        {
            _contextMock = new Mock<IApplicationDbContext>();

            _handler = new GetCategoriesQueryHandler(
                _contextMock.Object);
        }

        [Fact]
        public async Task Should_Return_All_Categories()
        {
            // Arrange
            var categories = new List<Category>
            {
                new Category("Vegetables", "Fresh vegetables"),
                new Category("Fruits", "Fresh fruits")
            };

            _contextMock
                .Setup(x => x.Categories)
                .ReturnsDbSet(categories);

            var query = new GetCategoriesQuery();

            // Act
            var result = await _handler.Handle(
                query,
                CancellationToken.None);

            // Assert
            result.Should().NotBeNull();
            result.Should().HaveCount(2);

            result.Should().Contain(c =>
                c.Name == "Vegetables" &&
                c.Description == "Fresh vegetables");

            result.Should().Contain(c =>
                c.Name == "Fruits" &&
                c.Description == "Fresh fruits");
        }


        [Fact]
        public async Task Should_Return_Empty_List_When_No_Categories_Exist()
        {
            // Arrange
            var categories = new List<Category>();

            _contextMock
                .Setup(x => x.Categories)
                .ReturnsDbSet(categories);

            var query = new GetCategoriesQuery();

            // Act
            var result = await _handler.Handle(
                query,
                CancellationToken.None);

            // Assert
            result.Should().NotBeNull();
            result.Should().BeEmpty();
        }

        [Fact]
        public async Task Should_Return_Categories_As_Dtos()
        {
            // Arrange
            var categories = new List<Category>
            {
                new Category("Vegetables", "Fresh vegetables"),
                new Category("Fruits", "Fresh fruits")
            };

            _contextMock
                .Setup(x => x.Categories)
                .ReturnsDbSet(categories);

            var query = new GetCategoriesQuery();

            // Act
            var result = await _handler.Handle(
                query,
                CancellationToken.None);

            // Assert
            result.Should().NotBeNull();

            result.Should().AllSatisfy(category =>
            {
                category.Should().BeOfType<CategoryDto>();
            });
        }


        [Fact]
        public async Task Should_Return_Categories_In_Expected_Order()
        {
            // Arrange
            var categories = new List<Category>
            {
                new Category("Vegetables", "Fresh vegetables"),
                new Category("Fruits", "Fresh fruits"),
                new Category("Flowers", "Beautiful flowers")
            };

            _contextMock
                .Setup(x => x.Categories)
                .ReturnsDbSet(categories);

            var query = new GetCategoriesQuery();

            // Act
            var result = await _handler.Handle(
                query,
                CancellationToken.None);

            // Assert
            result.Should().BeInAscendingOrder(x => x.Name);
        }



    }
}
