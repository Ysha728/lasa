/**
 * Food video catalog.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  REPLACE ME: this is the ONLY file you need to edit to swap in real videos.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Each entry describes one video card. To use a real video later:
 *
 *   1. Set `videoUrl` to the real video source. It can be:
 *        - a direct file, e.g. "/assets/videos/chicken-inasal.mp4"
 *        - a YouTube embed, e.g. "https://www.youtube.com/embed/VIDEO_ID"
 *   2. Set `thumbnail` to a real image path under /assets/images/.
 *   3. Set `isPlaceholder` to `false` so the "Placeholder video" label
 *      disappears automatically.
 *
 * Nothing else in the app needs to change — the Food Videos section reads
 * straight from this list.
 */

/** One video card in the Food Videos section. */
export interface FoodVideo {
  /** Stable id used for React keys and test markers. */
  id: string;
  /** Card title shown under the thumbnail. */
  title: string;
  /** One-line description of what the video shows. */
  description: string;
  /** Thumbnail image path under /assets/images/. */
  thumbnail: string;
  /**
   * The video source opened by the inline player.
   * Leave as "" while the video is still a placeholder.
   */
  videoUrl: string;
  /**
   * `true` while this is a stand-in for a real video. The card shows a visible
   * "Placeholder video — replace later" label whenever this is true.
   */
  isPlaceholder: boolean;
}

/**
 * The six placeholder videos, one per featured dish.
 *
 * These reuse the dish photos as thumbnails so the section looks finished
 * today, and every card is clearly labeled as a placeholder.
 */
export const FOOD_VIDEOS: FoodVideo[] = [
  {
    id: "chicken-inasal",
    title: "Grilling Chicken Inasal",
    description:
      "Watch the annatto basting and charcoal smoke that give inasal its glow.",
    thumbnail: "/lasa/assets/images/chicken-inasal.jpg",
    videoUrl: "https://www.youtube.com/embed/cQOL1T_CL48",
    isPlaceholder: false,
  },
  {
    id: "laing",
    title: "Simmering Laing Low and Slow",
    description:
      "Taro leaves and coconut milk coming together into a creamy Bicolano classic.",
    thumbnail: "/lasa/assets/images/laing.jpg",
    videoUrl: "https://www.youtube.com/embed/APn5op5HpgY",
    isPlaceholder: false,
  },
  {
    id: "bulalo",
    title: "A Pot of Bulalo for Rainy Days",
    description:
      "Hours of gentle boiling until the beef falls apart and the broth runs clear.",
    thumbnail: "/lasa/assets/images/bulalo.jpg",
    videoUrl: "https://www.youtube.com/embed/xC0c4fm1KRE",
    isPlaceholder: false,
  },
  {
    id: "pizza",
    title: "Ninety Seconds in a Wood-Fired Oven",
    description:
      "Stretching the dough and watching a Neapolitan pizza puff and char.",
    thumbnail: "/assets/images/pizza.jpg",
    videoUrl: "",
    isPlaceholder: true,
  },
  {
    id: "paella",
    title: "Chasing the Perfect Socarrat",
    description:
      "Saffron rice cooked wide and shallow until the bottom crisps just right.",
    thumbnail: "/assets/images/paella.jpg",
    videoUrl: "",
    isPlaceholder: true,
  },
  {
    id: "hamburger",
    title: "Building the Classic Burger",
    description:
      "A juicy grilled patty stacked with cheese and fresh toppings in a toasted bun.",
    thumbnail: "/assets/images/hamburger.jpg",
    videoUrl: "",
    isPlaceholder: true,
  },
];
