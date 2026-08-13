using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using RooftopGarden.Domain.Constants;
using RooftopGarden.Domain.Entities;
using RooftopGarden.Domain.Enums;
using RooftopGarden.Infrastructure.Identity;

namespace RooftopGarden.Infrastructure.Persistence.Seed;

/// <summary>
/// Idempotent demo/reference data for Categories, Products, Services, demo Customers,
/// Blog posts and Reviews. Every step checks for an existing row by a unique field
/// (name/email/title, or customer+product for reviews) before inserting — safe to run
/// on every startup. Never deletes or overwrites existing data.
/// </summary>
public static class DemoDataSeeder
{
    private const string AdminEmail = "admin@rooftopgarden.com";
    private const string DemoPassword = "Passw0rd!23";

    private record SeedStepResult(int Created, int Skipped);

    public static async Task SeedAsync(IServiceProvider services)
    {
        var dbContext = services.GetRequiredService<ApplicationDbContext>();
        var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
        var logger = services.GetRequiredService<ILoggerFactory>().CreateLogger("DemoDataSeeder");

        var (categoriesResult, categoryIdsByName) = await SeedCategoriesAsync(dbContext);
        var (productsResult, productIdsByName) = await SeedProductsAsync(dbContext, categoryIdsByName);
        var servicesResult = await SeedServicesAsync(dbContext);
        var (customersResult, customerIds) = await SeedDemoCustomersAsync(userManager);

        var admin = await userManager.FindByEmailAsync(AdminEmail);
        var blogsResult = admin is null
            ? new SeedStepResult(0, 0)
            : await SeedBlogPostsAsync(dbContext, admin.Id);

        var reviewsResult = await SeedReviewsAsync(dbContext, productIdsByName, customerIds);

        await dbContext.SaveChangesAsync(CancellationToken.None);

        logger.LogInformation(
            "Demo data seed complete — " +
            "Categories: {CatCreated} created/{CatSkipped} skipped; " +
            "Products: {ProdCreated}/{ProdSkipped}; " +
            "Services: {SvcCreated}/{SvcSkipped}; " +
            "Demo customers: {CustCreated}/{CustSkipped}; " +
            "Blog posts: {BlogCreated}/{BlogSkipped}; " +
            "Reviews: {RevCreated}/{RevSkipped}",
            categoriesResult.Created, categoriesResult.Skipped,
            productsResult.Created, productsResult.Skipped,
            servicesResult.Created, servicesResult.Skipped,
            customersResult.Created, customersResult.Skipped,
            blogsResult.Created, blogsResult.Skipped,
            reviewsResult.Created, reviewsResult.Skipped);
    }

    private static async Task<(SeedStepResult, Dictionary<string, int>)> SeedCategoriesAsync(ApplicationDbContext dbContext)
    {
        var wanted = new[]
        {
            ("Succulents", "Low-maintenance desert plants"),
            ("Herbs", "Culinary and aromatic herbs"),
            ("Flowering Plants", "Colorful blooms for balconies and rooftops"),
            ("Vegetables", "Grow-your-own rooftop vegetables"),
            ("Indoor Plants", "Houseplants for shaded rooftop corners and indoor spaces"),
            ("Pots & Planters", "Containers for every plant size"),
            ("Soil & Fertilizers", "Potting mixes and plant nutrition"),
            ("Gardening Tools", "Hand tools and rooftop gardening equipment"),
            ("Seeds", "Seeds for vegetables, herbs and flowers"),
            ("Seeding Trays", "Trays and propagation domes for starting seedlings"),
            ("Sprinkler & Irrigation", "Watering and irrigation equipment for rooftop gardens"),
            ("Packaging Materials", "Tags, labels and wrapping for plants and produce"),
            ("Stones & Pebbles", "Decorative stones and ground cover for planters"),
        };

        var existing = await dbContext.Categories.ToDictionaryAsync(c => c.Name, c => c.Id);
        int created = 0, skipped = 0;

        foreach (var (name, description) in wanted)
        {
            if (existing.ContainsKey(name))
            {
                skipped++;
                continue;
            }

            var category = new Category(name, description);
            dbContext.Categories.Add(category);
            await dbContext.SaveChangesAsync(CancellationToken.None);

            existing[name] = category.Id;
            created++;
        }

        return (new SeedStepResult(created, skipped), existing);
    }

    private static async Task<(SeedStepResult, Dictionary<string, int>)> SeedProductsAsync(
        ApplicationDbContext dbContext,
        Dictionary<string, int> categoryIdsByName)
    {
        var wanted = new[]
        {
            // Original hand-authored batch — no image (none supplied at the time).
            ("Echeveria Elegans", "Succulents", 14.99m, 50, PlantType.Succulent, SunlightRequirement.FullSun, WaterRequirement.Low,
                "A rosette-forming succulent perfect for sunny rooftop corners.", (string?)null),
            ("Basil - Genovese", "Herbs", 6.50m, 100, PlantType.Herb, SunlightRequirement.FullSun, WaterRequirement.Medium,
                "Classic Italian basil, great for pots and rooftop planters.", null),
            ("Rosemary", "Herbs", 7.25m, 80, PlantType.Herb, SunlightRequirement.FullSun, WaterRequirement.Low,
                "Fragrant, drought-tolerant herb ideal for rooftop containers.", null),
            ("Mint", "Herbs", 5.50m, 70, PlantType.Herb, SunlightRequirement.PartialShade, WaterRequirement.Medium,
                "Vigorous grower — best kept in its own container.", null),
            ("Marigold", "Flowering Plants", 5.99m, 120, PlantType.Flower, SunlightRequirement.FullSun, WaterRequirement.Medium,
                "Bright, pest-repelling blooms perfect for rooftop borders.", null),
            ("Rooftop Tomato - Cherry", "Vegetables", 8.99m, 60, PlantType.Vegetable, SunlightRequirement.FullSun, WaterRequirement.Medium,
                "Compact cherry tomato variety bred for container growing.", null),
            ("Terracotta Pot - 12 inch", "Pots & Planters", 12.00m, 200, PlantType.Other, SunlightRequirement.FullSun, WaterRequirement.Low,
                "Classic terracotta planter with a drainage hole, 12-inch diameter.", null),
            ("Organic Potting Mix - 20L", "Soil & Fertilizers", 15.50m, 150, PlantType.Other, SunlightRequirement.FullSun, WaterRequirement.Low,
                "Nutrient-rich organic potting mix suited for rooftop containers.", null),
            ("Hand Trowel Set", "Gardening Tools", 9.75m, 90, PlantType.Other, SunlightRequirement.FullSun, WaterRequirement.Low,
                "Stainless steel hand trowel and cultivator set.", null),
            ("Sunflower Seeds Pack", "Seeds", 3.25m, 300, PlantType.Flower, SunlightRequirement.FullSun, WaterRequirement.Medium,
                "Pack of 20 tall sunflower seeds — a rooftop favorite.", null),

            // Sourced from a real gardening-marketplace reference dataset — names, categories,
            // stock and images kept from that source; enum fields assigned to fit our schema.
            ("Propagation Tray with Dome", "Seeding Trays", 265m, 12, PlantType.Other, SunlightRequirement.FullSun, WaterRequirement.Low,
                "Seed-starting tray with a clear humidity dome for faster germination.",
                "https://i.ibb.co/5rp5NRC/ptd.jpg"),
            ("Gardening Tools & Accessories Kit", "Gardening Tools", 1200m, 25, PlantType.Other, SunlightRequirement.FullSun, WaterRequirement.Low,
                "All-in-one hand tool kit for rooftop and container gardening.",
                "https://i.ibb.co/njC1bkG/gt.jpg"),
            ("Oscillating Lawn Sprinkler", "Sprinkler & Irrigation", 2500m, 10, PlantType.Other, SunlightRequirement.FullSun, WaterRequirement.Low,
                "Wide-coverage oscillating sprinkler for larger rooftop garden beds.",
                "https://i.ibb.co/StW9tN6/olp.jpg"),
            ("Organic Potting Soil", "Soil & Fertilizers", 10m, 15, PlantType.Other, SunlightRequirement.FullSun, WaterRequirement.Low,
                "Everyday organic potting soil for containers and raised beds.",
                "https://i.ibb.co/DY3gcVB/CF.jpg"),
            ("Biodegradable Tray", "Seeding Trays", 140m, 50, PlantType.Other, SunlightRequirement.FullSun, WaterRequirement.Low,
                "Compostable seedling tray — plant the whole tray straight into soil.",
                "https://i.ibb.co/hCRdFfJ/bio.jpg"),
            ("Pothos", "Indoor Plants", 400m, 12, PlantType.Vine, SunlightRequirement.PartialShade, WaterRequirement.Medium,
                "Trailing, air-purifying houseplant that tolerates low light well.",
                "https://i.ibb.co/Wy1c4dS/eap.jpg"),
            ("Plant Tags with Strings", "Packaging Materials", 20m, 30, PlantType.Other, SunlightRequirement.FullSun, WaterRequirement.Low,
                "Hanging labels for marking plant varieties in trays and beds.",
                "https://i.ibb.co/9gSSrJW/pts.jpg"),
            ("Watering Pot", "Pots & Planters", 99m, 4, PlantType.Other, SunlightRequirement.FullSun, WaterRequirement.Low,
                "Classic watering can sized for balcony and rooftop containers.",
                "https://i.ibb.co/WvLHQCj/watering-pot.png"),
            ("Sunflower Seeds", "Seeds", 201m, 10, PlantType.Flower, SunlightRequirement.FullSun, WaterRequirement.Medium,
                "Seed packet for tall, classic sunflowers.",
                "https://i.ibb.co/f8nSCYK/SS1.jpg"),
            ("Vermiculite Soil Mix", "Soil & Fertilizers", 345m, 13, PlantType.Other, SunlightRequirement.FullSun, WaterRequirement.Low,
                "Lightweight vermiculite blend for improved seedling drainage.",
                "https://i.ibb.co/7G6sBN4/VSS-JPG.jpg"),
            ("Garden Pruning Shears", "Gardening Tools", 500m, 35, PlantType.Other, SunlightRequirement.FullSun, WaterRequirement.Low,
                "Sharp, comfortable-grip shears for pruning and light trimming.",
                "https://i.ibb.co/M1SshvG/gps.jpg"),
            ("Hanging Planter Basket", "Pots & Planters", 120m, 15, PlantType.Other, SunlightRequirement.FullSun, WaterRequirement.Low,
                "Space-saving hanging basket for balcony rails and rooftop frames.",
                "https://i.ibb.co/Gd6F6V5/hpb.jpg"),
            ("Terracotta Flower Pot", "Pots & Planters", 50m, 15, PlantType.Other, SunlightRequirement.FullSun, WaterRequirement.Low,
                "Breathable terracotta pot for flowering plants and herbs.",
                "https://i.ibb.co/J5KTJ9X/tfp.jpg"),
            ("Garden Hose Nozzle", "Sprinkler & Irrigation", 350m, 15, PlantType.Other, SunlightRequirement.FullSun, WaterRequirement.Low,
                "Adjustable-spray nozzle for hand watering rooftop containers.",
                "https://i.ibb.co/hfKCCcT/ghn.jpg"),
            ("Drip Irrigation Kit", "Sprinkler & Irrigation", 2000m, 8, PlantType.Other, SunlightRequirement.FullSun, WaterRequirement.Low,
                "Complete drip irrigation kit for consistent, low-waste watering.",
                "https://i.ibb.co/4Z4PtY7/ddik.jpg"),
            ("Plant Wrapping Paper", "Packaging Materials", 25m, 25, PlantType.Other, SunlightRequirement.FullSun, WaterRequirement.Low,
                "Decorative wrapping for gifting potted plants.",
                "https://i.ibb.co/94PKWSG/pwp.jpg"),
            ("Tomato Seeds", "Seeds", 120m, 15, PlantType.Vegetable, SunlightRequirement.FullSun, WaterRequirement.Medium,
                "Seed packet for container-friendly tomato varieties.",
                "https://i.ibb.co/9TrRhpP/363861011-296330249576333-6887696145444161890-n.jpg"),
            ("Gardening Gloves", "Gardening Tools", 200m, 13, PlantType.Other, SunlightRequirement.FullSun, WaterRequirement.Low,
                "Durable, breathable gloves for everyday rooftop garden work.",
                "https://i.ibb.co/Jk0yfZN/gg.jpg"),
            ("Self Watering Plant Pot", "Pots & Planters", 350m, 9, PlantType.Other, SunlightRequirement.FullSun, WaterRequirement.Low,
                "Reservoir-base pot that reduces watering frequency for busy schedules.",
                "https://i.ibb.co/DGxpW3b/spp.jpg"),
            ("Snake Plant", "Indoor Plants", 250m, 11, PlantType.Succulent, SunlightRequirement.PartialShade, WaterRequirement.Low,
                "Extremely low-maintenance, low-light-tolerant houseplant.",
                "https://i.ibb.co/HT1GbMB/san.jpg"),
            ("Plastic Seeding Tray", "Seeding Trays", 300m, 15, PlantType.Other, SunlightRequirement.FullSun, WaterRequirement.Low,
                "Reusable multi-cell tray for starting seedlings before transplanting.",
                "https://i.ibb.co/7XfGzjV/pst-jpg.jpg"),
            ("Basil Seeds", "Seeds", 80m, 12, PlantType.Herb, SunlightRequirement.FullSun, WaterRequirement.Medium,
                "Seed packet for classic culinary basil.",
                "https://i.ibb.co/3rr0sNN/BASIL.jpg"),
            ("Compost Fertilizer", "Soil & Fertilizers", 12m, 15, PlantType.Other, SunlightRequirement.FullSun, WaterRequirement.Low,
                "Nutrient-rich compost blend for feeding rooftop containers.",
                "https://i.ibb.co/4gq51mw/CFF-JPG.jpg"),
            ("Decorative Stones", "Stones & Pebbles", 700m, 50, PlantType.Other, SunlightRequirement.FullSun, WaterRequirement.Low,
                "Decorative ground-cover stones for planters and pathways.",
                "https://i.ibb.co/GHWmpWm/stone.jpg"),
            ("Fiddle Leaf Fig", "Indoor Plants", 700m, 15, PlantType.Tree, SunlightRequirement.PartialSun, WaterRequirement.Medium,
                "Popular statement houseplant with large, glossy leaves.",
                "https://i.ibb.co/Gs9v087/ficus.jpg"),
        };

        var existing = await dbContext.Products.ToDictionaryAsync(p => p.Name, p => p.Id);
        int created = 0, skipped = 0;

        foreach (var (name, categoryName, price, stock, plantType, sunlight, water, description, imageUrl) in wanted)
        {
            if (existing.ContainsKey(name))
            {
                skipped++;
                continue;
            }

            if (!categoryIdsByName.TryGetValue(categoryName, out var categoryId))
            {
                continue; // category wasn't seeded/found — skip rather than insert a dangling FK
            }

            var product = new Product(name, price, stock, categoryId, plantType, sunlight, water, description, imageUrl);
            dbContext.Products.Add(product);
            await dbContext.SaveChangesAsync(CancellationToken.None);

            existing[name] = product.Id;
            created++;
        }

        return (new SeedStepResult(created, skipped), existing);
    }

    private static async Task<SeedStepResult> SeedServicesAsync(ApplicationDbContext dbContext)
    {
        var wanted = new[]
        {
            ("Rooftop Garden Design & Consultation", 175.00m, TimeSpan.FromHours(2.5),
                "Personalized rooftop garden design plan with an on-site consultation visit."),
            ("Garden Installation", 350.00m, TimeSpan.FromHours(6),
                "Full installation of your designed rooftop garden, including soil and planting."),
            ("Irrigation Setup", 220.00m, TimeSpan.FromHours(4),
                "Drip irrigation installation for consistent, efficient watering."),
            ("Seasonal Garden Maintenance", 90.00m, TimeSpan.FromHours(1.5),
                "Routine pruning, feeding, and pest check for your rooftop garden."),
            ("Vertical Garden Installation", 280.00m, TimeSpan.FromHours(5),
                "Space-saving vertical planting systems for balconies and walls."),
        };

        var existingNames = await dbContext.Services.Select(s => s.Name).ToListAsync();
        var existingSet = existingNames.ToHashSet();
        int created = 0, skipped = 0;

        foreach (var (name, price, duration, description) in wanted)
        {
            if (existingSet.Contains(name))
            {
                skipped++;
                continue;
            }

            dbContext.Services.Add(new Service(name, price, duration, description));
            created++;
        }

        if (created > 0)
        {
            await dbContext.SaveChangesAsync(CancellationToken.None);
        }

        return new SeedStepResult(created, skipped);
    }

    private static async Task<(SeedStepResult, List<string>)> SeedDemoCustomersAsync(UserManager<ApplicationUser> userManager)
    {
        var wanted = new[]
        {
            ("alice.green@example.com", "Alice Green"),
            ("ben.carter@example.com", "Ben Carter"),
            ("priya.sharma@example.com", "Priya Sharma"),
        };

        var ids = new List<string>();
        int created = 0, skipped = 0;

        foreach (var (email, fullName) in wanted)
        {
            var existingUser = await userManager.FindByEmailAsync(email);
            if (existingUser is not null)
            {
                ids.Add(existingUser.Id);
                skipped++;
                continue;
            }

            var user = new ApplicationUser
            {
                UserName = email,
                Email = email,
                FullName = fullName,
                EmailConfirmed = true,
            };

            var result = await userManager.CreateAsync(user, DemoPassword);
            if (!result.Succeeded)
            {
                continue;
            }

            await userManager.AddToRoleAsync(user, Roles.Customer);
            ids.Add(user.Id);
            created++;
        }

        return (new SeedStepResult(created, skipped), ids);
    }

    private static async Task<SeedStepResult> SeedBlogPostsAsync(ApplicationDbContext dbContext, string authorId)
    {
        var wanted = new[]
        {
            ("5 Easy Herbs to Start Your Rooftop Garden",
                "Basil, rosemary, mint, thyme and chives are forgiving, fast-growing, and thrive in containers. " +
                "Start with a sunny spot, well-draining soil, and water when the top inch feels dry."),
            ("Choosing the Right Pots for a Windy Rooftop",
                "Rooftops catch more wind than ground-level gardens. Favor wider, heavier pots with a low center " +
                "of gravity, and group containers together to reduce individual wind exposure."),
            ("A Beginner's Guide to Rooftop Composting",
                "A small bin composting system can turn kitchen scraps into free, nutrient-rich soil for your " +
                "rooftop containers — no backyard required."),
            ("How Much Sunlight Does Your Rooftop Really Get?",
                "Track sun exposure across a full day before choosing plants. South-facing rooftops in the " +
                "northern hemisphere usually get full sun; shaded corners near walls or vents need shade-tolerant picks."),
        };

        var existingTitles = (await dbContext.Blogs.Select(b => b.Title).ToListAsync()).ToHashSet();
        int created = 0, skipped = 0;

        foreach (var (title, content) in wanted)
        {
            if (existingTitles.Contains(title))
            {
                skipped++;
                continue;
            }

            dbContext.Blogs.Add(new Blog(title, content, authorId));
            created++;
        }

        if (created > 0)
        {
            await dbContext.SaveChangesAsync(CancellationToken.None);
        }

        return new SeedStepResult(created, skipped);
    }

    private static async Task<SeedStepResult> SeedReviewsAsync(
        ApplicationDbContext dbContext,
        Dictionary<string, int> productIdsByName,
        List<string> customerIds)
    {
        if (customerIds.Count < 2)
        {
            return new SeedStepResult(0, 0);
        }

        var wanted = new[]
        {
            (customerIds[0], "Echeveria Elegans", 5, "Thriving on my sunny balcony — very easy to care for!"),
            (customerIds[1], "Basil - Genovese", 4, "Grew fast, great for pasta nights."),
            (customerIds.Count > 2 ? customerIds[2] : customerIds[0], "Rooftop Tomato - Cherry", 5, "Sweet cherry tomatoes all summer long."),
            (customerIds[0], "Marigold", 4, "Kept the pests away from my veggies as promised."),
            (customerIds[1], "Rosemary", 5, "Survived the whole winter on my exposed rooftop."),
        };

        var existingPairs = (await dbContext.Reviews
            .Select(r => new { r.CustomerId, r.ProductId })
            .ToListAsync())
            .Select(r => (r.CustomerId, r.ProductId))
            .ToHashSet();

        int created = 0, skipped = 0;

        foreach (var (customerId, productName, rating, comment) in wanted)
        {
            if (!productIdsByName.TryGetValue(productName, out var productId))
            {
                continue; // product wasn't seeded/found — nothing to attach the review to
            }

            if (existingPairs.Contains((customerId, productId)))
            {
                skipped++;
                continue;
            }

            dbContext.Reviews.Add(new Review(productId, customerId, rating, comment));
            existingPairs.Add((customerId, productId));
            created++;
        }

        if (created > 0)
        {
            await dbContext.SaveChangesAsync(CancellationToken.None);
        }

        return new SeedStepResult(created, skipped);
    }
}
