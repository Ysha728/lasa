/**
 * Canonical LASA food catalog.
 *
 * This is the single source of truth for the six dishes featured on the site.
 * Page tasks import `FOODS` (and the helpers below) instead of hardcoding data.
 * The `id` values match the backend's food ids so favorites, reviews, and
 * comments line up with the right dish.
 */
import type { Food, FoodCategory } from "@/types/lasa";

export const FOODS: Food[] = [
  {
    id: 1,
    slug: "chicken-inasal",
    name: "Chicken Inasal",
    category: "local",
    country: "Philippines",
    origin: "Bacolod City, Negros Occidental",
    tagline:
      "Smoky, citrusy grilled chicken that smells like a Bacolod fiesta.",
    history:
      "Inasal comes from the Hiligaynon word for 'grilled' or 'roasted'. It grew out of the backyard grilling traditions of Bacolod City and became a beloved street-food staple, later spreading across the whole country through chains and family stalls.",
    ingredients: [
      "Chicken leg quarters",
      "Calamansi (Philippine lime)",
      "Lemongrass",
      "Ginger",
      "Garlic",
      "Vinegar",
      "Annatto (atsuete) oil",
      "Brown sugar and salt",
    ],
    preparation:
      "The chicken is marinated in calamansi, vinegar, lemongrass, ginger, and garlic, then basted with bright orange annatto oil while grilled over hot charcoal. It is served with rice and a dipping sauce of soy, vinegar, and chili.",
    culturalSignificance:
      "Inasal is a point of pride in Bacolod and a symbol of Filipino communal eating — orders are shared, rice is unlimited, and the grill becomes the center of the gathering.",
    funFacts: [
      "The orange glow of inasal comes from annatto seeds, not food coloring.",
      "Bacolod holds an annual Chicken Inasal Festival celebrating the dish.",
      "Locals eat it with bare hands, dipping each bite in sinamak vinegar.",
    ],
    image: "lasa/assets/images/chicken-inasal.jpg",
    emoji: "🍗",
  },
  {
    id: 2,
    slug: "laing",
    name: "Laing",
    category: "local",
    country: "Philippines",
    origin: "Bicol Region",
    tagline: "Creamy coconut taro leaves with a slow, gentle chili warmth.",
    history:
      "Laing is a Bicolano classic born from the region's love of coconut milk and chilies. Dried taro leaves are simmered until tender in a rich, spiced coconut sauce, a technique passed down through generations of Bicolano home cooks.",
    ingredients: [
      "Dried taro (gabi) leaves",
      "Coconut milk and coconut cream",
      "Shrimp paste (bagoong)",
      "Bird's eye chilies",
      "Ginger",
      "Garlic and onion",
      "Pork or dried fish (optional)",
    ],
    preparation:
      "The taro leaves are simmered low and slow in coconut milk with aromatics and chilies until the leaves soften and the sauce thickens and turns glossy. It is never stirred too early, so the leaves keep their shape.",
    culturalSignificance:
      "Laing represents Bicol's signature coconut-and-chili cooking and is a staple at Filipino gatherings, often paired with plain rice to balance its richness.",
    funFacts: [
      "Bicol is famous across the Philippines for cooking with coconut milk.",
      "The dish is even better the next day as the flavors deepen.",
      "Fresh taro leaves must be cooked thoroughly — they are itchy when raw.",
    ],
    image: "lasa/assets/images/laing.jpg",
    emoji: "🥬",
  },
  {
    id: 3,
    slug: "bulalo",
    name: "Bulalo",
    category: "local",
    country: "Philippines",
    origin: "Batangas",
    tagline: "A clear, soul-warming beef marrow soup for cool rainy days.",
    history:
      "Bulalo originated in Batangas, where cattle ranching and cool highland weather made a hearty boiled-beef soup a natural fit. It became a favorite stop for travelers heading south of Manila.",
    ingredients: [
      "Beef shanks with bone marrow",
      "Corn on the cob",
      "Napa cabbage or pechay",
      "Potatoes",
      "Onion and garlic",
      "Peppercorns",
      "Fish sauce",
    ],
    preparation:
      "Beef shanks are boiled for hours until the meat is fall-apart tender and the broth is rich. Corn, potatoes, and greens are added near the end, and the marrow is scooped out to enrich the soup.",
    culturalSignificance:
      "Bulalo is comfort food tied to Batangas and to cool-weather gatherings. Sharing a steaming pot is a weekend ritual for families and road-trippers.",
    funFacts: [
      "The prized part is the marrow, often spread on rice or bread.",
      "Batangas bulalo spots are a classic stop on the way to Tagaytay.",
      "The broth is traditionally kept clear rather than thick.",
    ],
    image: "lasa/assets/images/bulalo.jpg",
    emoji: "🍲",
  },
  {
    id: 4,
    slug: "pizza",
    name: "Pizza",
    category: "international",
    country: "Italy",
    origin: "Naples, Italy",
    tagline: "Blistered dough, bright tomato, and molten mozzarella.",
    history:
      "Modern pizza took shape in Naples, where flatbreads topped with tomato and cheese fed working families. The Margherita, named for Queen Margherita, helped turn a local street food into a global icon.",
    ingredients: [
      "Pizza dough (flour, water, yeast, salt)",
      "San Marzano tomatoes",
      "Fresh mozzarella",
      "Fresh basil",
      "Olive oil",
    ],
    preparation:
      "The dough is fermented, stretched by hand, topped sparingly, and baked at very high heat — traditionally in a wood-fired oven — so the crust puffs and chars in about ninety seconds.",
    culturalSignificance:
      "Neapolitan pizza is protected as a cultural treasure, and 'pizzaiuolo' craft is recognized by UNESCO. Pizza is now a shared global language of comfort food.",
    funFacts: [
      "The Margherita's colors mirror the Italian flag: red, white, and green.",
      "True Neapolitan pizza has a soft, foldable center.",
      "Naples has an association that certifies authentic Neapolitan pizza.",
    ],
    image: "lasa/assets/images/pizza.jpg",
    emoji: "🍕",
  },
  {
    id: 5,
    slug: "paella",
    name: "Paella",
    category: "international",
    country: "Spain",
    origin: "Valencia, Spain",
    tagline: "Saffron rice cooked wide and shallow until the edges crisp.",
    history:
      "Paella began in the rice fields around Valencia, cooked by farm workers over open fires with whatever the land offered. It grew into Spain's most famous communal dish, with many regional variations.",
    ingredients: [
      "Bomba or short-grain rice",
      "Saffron",
      "Chicken and rabbit (traditional)",
      "Green beans and lima beans",
      "Tomato",
      "Olive oil",
      "Seafood (in coastal versions)",
    ],
    preparation:
      "A wide, shallow pan is used so the rice cooks in a thin layer. Aromatics and proteins are sautéed, broth and saffron are added, and the rice is left undisturbed to form the prized crispy bottom called socarrat.",
    culturalSignificance:
      "Paella is a symbol of Spanish togetherness, traditionally cooked outdoors in a large pan and shared straight from it at family celebrations.",
    funFacts: [
      "The crispy rice at the bottom is called socarrat and is highly prized.",
      "Valencia's original paella uses rabbit and chicken, not seafood.",
      "The word 'paella' comes from the Latin word for pan.",
    ],
    image: "lasa/assets/images/paella.jpg",
    emoji: "🥘",
  },
  {
    id: 6,
    slug: "hamburger",
    name: "Hamburger",
    category: "international",
    country: "United States",
    origin: "United States",
    tagline: "A juicy grilled patty stacked in a soft toasted bun.",
    history:
      "The hamburger evolved from German and American food traditions in the late 1800s, when ground beef patties met soft buns at fairs and lunch counters. It quickly became a defining American food.",
    ingredients: [
      "Ground beef",
      "Soft burger buns",
      "Cheese",
      "Lettuce and tomato",
      "Onion",
      "Pickles",
      "Condiments (ketchup, mustard, mayo)",
    ],
    preparation:
      "Ground beef is formed into patties, seasoned, and grilled or griddled until browned. The patty is layered into a toasted bun with cheese, vegetables, and sauces to taste.",
    culturalSignificance:
      "The hamburger is a global symbol of casual dining and roadside Americana, endlessly customizable and shared at cookouts, diners, and drive-ins.",
    funFacts: [
      "Several US towns claim to have invented the hamburger.",
      "The world's largest burger chains turned it into a global staple.",
      "A 'smash burger' sears the patty for a crisp, lacy crust.",
    ],
    image: "lasa/assets/images/hamburger.jpg",
    emoji: "🍔",
  },
];

/** Look up a single food by its numeric backend id. */
export function getFoodById(id: number): Food | undefined {
  return FOODS.find((food) => food.id === id);
}

/** Look up a single food by its URL slug. */
export function getFoodBySlug(slug: string): Food | undefined {
  return FOODS.find((food) => food.slug === slug);
}

/** Filter the catalog by category, or return everything for "all". */
export function filterFoods(category: FoodCategory | "all"): Food[] {
  if (category === "all") return FOODS;
  return FOODS.filter((food) => food.category === category);
}

/** Total number of dishes in the catalog (used by the passport). */
export const TOTAL_FOODS = FOODS.length;
