using FluentAssertions;
using RooftopGarden.Application.Features.Categories.Queries.GetCategories;
using RooftopGarden.Application.Features.Categories.Queries.GetCategoryById;

namespace RooftopGarden.Application.UnitTests.Features.Categories.Queries.GetCategories
{
    public class GetCategoriesQueryTests
    {
        [Fact]
        public void Should_Create_GetCategoriesQuery()
        {
            // Act
            var query = new GetCategoriesQuery();

            // Assert
            query.Should().NotBeNull();
        }

        [Fact]
        public void Should_Create_GetCategoryByIdQuery()
        {
            // Arrange
            var categoryId = 1;

            // Act
            var query = new GetCategoryByIdQuery(categoryId);

            // Assert
            query.Should().NotBeNull();
            query.Id.Should().Be(categoryId);
        }

    }
}
