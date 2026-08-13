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
        var (customersResult, customerIdsByName) = await SeedDemoCustomersAsync(userManager);

        var admin = await userManager.FindByEmailAsync(AdminEmail);
        var blogsResult = admin is null
            ? new SeedStepResult(0, 0)
            : await SeedBlogPostsAsync(dbContext, admin.Id);

        var reviewsResult = await SeedReviewsAsync(dbContext, productIdsByName, customerIdsByName);

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

            // Sourced from a second reference dataset the user pasted (name + description only —
            // price/duration invented to fit this app's schema).
            ("Garden Design", 150.00m, TimeSpan.FromHours(2),
                "Our expert team will help you design the perfect rooftop garden for your space."),
            ("Plant Installation", 200.00m, TimeSpan.FromHours(3),
                "Let our skilled team install a wide variety of plants and flowers in your rooftop garden."),
            ("Irrigation System", 250.00m, TimeSpan.FromHours(4),
                "We'll set up a smart irrigation system to keep your rooftop garden lush and healthy."),
            ("Greenhouse Installation", 800.00m, TimeSpan.FromHours(8),
                "Get a custom-built greenhouse for year-round gardening and protection for your plants."),
            ("Roof Repairs", 300.00m, TimeSpan.FromHours(5),
                "If your rooftop needs repairs, we offer expert services to ensure a safe and stable garden."),
            ("Landscaping", 400.00m, TimeSpan.FromHours(6),
                "Transform your rooftop into a beautiful landscape with our professional landscaping services."),
            ("Outdoor Furniture", 180.00m, TimeSpan.FromHours(2),
                "Discover a wide range of outdoor furniture options to enhance your rooftop garden."),
            ("Lighting Solutions", 220.00m, TimeSpan.FromHours(3),
                "We offer creative and efficient lighting solutions to illuminate your rooftop garden."),
            ("Rooftop Maintenance", 90.00m, TimeSpan.FromHours(1.5),
                "Ensure your rooftop garden stays in top condition with our maintenance services."),
            ("Garden Maintenance", 90.00m, TimeSpan.FromHours(1.5),
                "Let our team take care of all the maintenance tasks to keep your rooftop garden thriving."),
            ("Composting", 60.00m, TimeSpan.FromHours(1),
                "Learn about composting and how to create nutrient-rich compost for your rooftop garden."),
            ("Lawn Care", 70.00m, TimeSpan.FromHours(1.5),
                "Maintain a beautiful and healthy lawn with our expert lawn care services."),
            ("Pest Control", 100.00m, TimeSpan.FromHours(1.5),
                "Keep your rooftop garden free from pests with our effective pest control solutions."),
            ("Vertical Gardening", 280.00m, TimeSpan.FromHours(4),
                "Create a beautiful and space-saving vertical garden on your rooftop with our expertise."),
            ("Fruit Trees", 150.00m, TimeSpan.FromHours(2),
                "Add fruit trees to your rooftop garden and enjoy fresh fruits right at your home."),
            ("Herb Garden", 80.00m, TimeSpan.FromHours(1.5),
                "Grow a variety of herbs in your rooftop garden for fresh flavors in your cooking."),
            ("Rooftop Oasis", 500.00m, TimeSpan.FromHours(6),
                "Create a serene rooftop oasis with comfortable seating and relaxing ambiance."),
            ("Sustainable Practices", 60.00m, TimeSpan.FromHours(1),
                "Learn about sustainable gardening practices to reduce environmental impact."),
            ("Organic Farming", 120.00m, TimeSpan.FromHours(2),
                "Discover the benefits of organic farming and grow fresh produce naturally."),
            ("Roof Insulation", 600.00m, TimeSpan.FromHours(6),
                "Improve energy efficiency by adding roof insulation for a cooler rooftop space."),
            ("Rainwater Harvesting", 350.00m, TimeSpan.FromHours(4),
                "Collect rainwater to water your garden and contribute to water conservation."),
            ("Greenhouse Construction", 900.00m, TimeSpan.FromHours(10),
                "Build a functional and efficient greenhouse to extend your growing season."),
            ("Green Roof Design", 450.00m, TimeSpan.FromHours(5),
                "Let our experts design and create a beautiful and sustainable green roof for your property."),
        };

        var existingSet = (await dbContext.Services.Select(s => s.Name).ToListAsync()).ToHashSet();
        int created = 0, skipped = 0;

        foreach (var (name, price, duration, description) in wanted)
        {
            if (!existingSet.Add(name))
            {
                // Add() returns false both for rows already in the DB and for a duplicate
                // name earlier in this same `wanted` list — either way, don't insert twice.
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

    private static async Task<(SeedStepResult, Dictionary<string, string>)> SeedDemoCustomersAsync(UserManager<ApplicationUser> userManager)
    {
        // Used directly for cart/order/booking demo flows.
        var wanted = new List<string>
        {
            "Alice Green",
            "Ben Carter",
            "Priya Sharma",
        };

        // Reviewer identities for the testimonial-style reviews in SeedReviewsAsync —
        // one account per name so each review has a real customer FK behind it.
        wanted.AddRange(new[]
        {
            "Sophia Jones", "Olivia Davis", "Isabella Hill", "Ethan Lopez", "Sophia Wilson",
            "Emily Hernandez", "Noah Taylor", "Daniel Moore", "James Gonzalez", "Jane Doe",
            "MJ Doe", "Emma Anderson", "Sarah Smith", "Alexander Lee", "Alexander Taylor",
            "James Wilson", "Emily Brown", "Ava Flores", "Robert Johnson", "Mia Garcia",
            "Michael Rodriguez", "William Perez", "John Doe", "Olivia Martin", "Ava Martinez",
            "Michael Williams", "William Miller",
        });

        var idsByName = new Dictionary<string, string>();
        int created = 0, skipped = 0;

        foreach (var fullName in wanted)
        {
            var email = $"{fullName.ToLowerInvariant().Replace(" ", ".")}@example.com";

            var existingUser = await userManager.FindByEmailAsync(email);
            if (existingUser is not null)
            {
                idsByName[fullName] = existingUser.Id;
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
            idsByName[fullName] = user.Id;
            created++;
        }

        return (new SeedStepResult(created, skipped), idsByName);
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
        Dictionary<string, string> customerIdsByName)
    {
        // (reviewer name, product name, rating, comment) — the first batch is tied to a
        // specific seeded product on purpose; the testimonial batch below isn't about any
        // particular plant, so it's distributed round-robin across the seeded catalog instead.
        var productSpecific = new[]
        {
            ("Alice Green", "Echeveria Elegans", 5, "Thriving on my sunny balcony — very easy to care for!"),
            ("Ben Carter", "Basil - Genovese", 4, "Grew fast, great for pasta nights."),
            ("Priya Sharma", "Rooftop Tomato - Cherry", 5, "Sweet cherry tomatoes all summer long."),
            ("Alice Green", "Marigold", 4, "Kept the pests away from my veggies as promised."),
            ("Ben Carter", "Rosemary", 5, "Survived the whole winter on my exposed rooftop."),
        };

        // Testimonials from a reference dataset — "Grow Green" replaced with "RooftopGarden".
        var testimonials = new[]
        {
            ("Sophia Jones", 5, "I recently purchased a plant from RooftopGarden, and it arrived in perfect condition. The packaging was excellent, ensuring the plant's safety during transit."),
            ("Olivia Davis", 5, "RooftopGarden offers an impressive selection of organic seeds. My plants are thriving, and I'm delighted with the results. Highly recommended for gardeners!"),
            ("Isabella Hill", 4, "I was new to rooftop gardening, but RooftopGarden's blog and guides helped me get started. Their resources are valuable for beginners."),
            ("Ethan Lopez", 5, "The variety of products and accessories is impressive. Whether you're a beginner or an experienced gardener, RooftopGarden has something for you."),
            ("Sophia Wilson", 4, "I appreciate RooftopGarden's commitment to sustainability and eco-friendly products. It aligns with my values as a conscious consumer."),
            ("Emily Hernandez", 4, "I've ordered gardening tools and accessories from RooftopGarden, and they are durable and reliable. Makes my gardening tasks easier."),
            ("Noah Taylor", 5, "I've been a loyal customer of RooftopGarden for years. Their products are always of the highest quality, and their team is knowledgeable and friendly."),
            ("Daniel Moore", 5, "The shipping is fast, and the packaging ensures that delicate plants arrive undamaged. I'm satisfied with the service and products."),
            ("James Gonzalez", 5, "RooftopGarden's website is my go-to for all my gardening needs. The layout is user-friendly, and the product descriptions are informative."),
            ("Jane Doe", 3, "Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like). It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout."),
            ("MJ Doe", 5, "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."),
            ("Emma Anderson", 5, "I recently started my rooftop garden and found everything I needed on RooftopGarden's website. The experience has been wonderful, and I'm excited to watch my plants grow."),
            ("Sarah Smith", 4, "I found the product to be incredibly useful and easy to use. The interface is intuitive, and it has all the features I need. Highly recommend it!"),
            ("Alexander Lee", 5, "I love the community aspect of RooftopGarden. Their blog and social media posts keep me inspired and connected to other gardeners."),
            ("Alexander Taylor", 4, "The prices at RooftopGarden are competitive, and they often have great deals. I've saved a lot while building my rooftop garden with them."),
            ("James Wilson", 5, "RooftopGarden's customer service team went above and beyond to help me with an issue. They are professional and genuinely care about their customers."),
            ("Emily Brown", 4, "I love the variety of products available on RooftopGarden. The quality is excellent, and the prices are reasonable. Definitely worth trying!"),
            ("Ava Flores", 5, "I've received compliments on my rooftop garden from friends and family. All thanks to the high-quality plants I got from RooftopGarden."),
            ("Robert Johnson", 5, "This is by far the best service I have ever used. The customer support is outstanding, and the product itself is top-notch. I couldn't be happier!"),
            ("Mia Garcia", 5, "I've purchased several plants from RooftopGarden, and each one arrived in excellent condition. They take care in packing and shipping."),
            ("Michael Rodriguez", 5, "The online shopping experience on RooftopGarden's website is smooth and enjoyable. I can easily find what I need and place an order quickly."),
            ("William Perez", 5, "The variety of plant seeds available on RooftopGarden's website is impressive. I can't wait to see my rooftop garden in full bloom."),
            ("John Doe", 2, "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."),
            ("Olivia Martin", 5, "I had some questions about rooftop gardening, and the RooftopGarden team was quick to respond and provide helpful information."),
            ("Ava Martinez", 5, "The quality of RooftopGarden's products is unmatched. I've recommended them to all my gardening friends, and they are equally impressed."),
            ("Michael Williams", 5, "As a rooftop gardening enthusiast, I am thrilled with the range of gardening tools and accessories they offer. Fast delivery and great customer service!"),
            ("William Miller", 4, "The website is easy to navigate, and the checkout process is seamless. I received updates about my order, and it arrived on time. Satisfied with my purchase!"),
        };

        var productIdsInOrder = productIdsByName.OrderBy(kvp => kvp.Key, StringComparer.Ordinal).Select(kvp => kvp.Value).ToList();

        var existingPairs = (await dbContext.Reviews
            .Select(r => new { r.CustomerId, r.ProductId })
            .ToListAsync())
            .Select(r => (r.CustomerId, r.ProductId))
            .ToHashSet();

        int created = 0, skipped = 0;

        void AddReview(string reviewerName, int productId, int rating, string comment)
        {
            if (!customerIdsByName.TryGetValue(reviewerName, out var customerId))
            {
                return; // reviewer account wasn't seeded/found — nothing to attach the review to
            }

            if (existingPairs.Contains((customerId, productId)))
            {
                skipped++;
                return;
            }

            dbContext.Reviews.Add(new Review(productId, customerId, rating, comment));
            existingPairs.Add((customerId, productId));
            created++;
        }

        foreach (var (reviewerName, productName, rating, comment) in productSpecific)
        {
            if (productIdsByName.TryGetValue(productName, out var productId))
            {
                AddReview(reviewerName, productId, rating, comment);
            }
        }

        if (productIdsInOrder.Count > 0)
        {
            for (var i = 0; i < testimonials.Length; i++)
            {
                var (reviewerName, rating, comment) = testimonials[i];
                var productId = productIdsInOrder[i % productIdsInOrder.Count];
                AddReview(reviewerName, productId, rating, comment);
            }
        }

        if (created > 0)
        {
            await dbContext.SaveChangesAsync(CancellationToken.None);
        }

        return new SeedStepResult(created, skipped);
    }
}
