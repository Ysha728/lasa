/**
 * FAQ content for the LASA site.
 *
 * Keeping the questions and answers here (instead of inside the component)
 * makes them easy to edit later without touching any React code. Each entry is
 * a simple `{ question, answer }` pair.
 */

/** One expandable question in the FAQ accordion. */
export interface FaqItem {
  /** Stable id used as the accordion item value and React key. */
  id: string;
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "what-is-lasa",
    question: "What is LASA?",
    answer:
      'LASA is a student-made food journal that celebrates both Filipino dishes and flavors from around the world. The name comes from the Filipino word for "taste," and the site is our way of sharing the food we grew up with and the dishes we have discovered.',
  },
  {
    id: "who-made-it",
    question: "Who made this project?",
    answer:
      "A group of students built LASA as a school project. We researched each dish, wrote the stories behind them, and designed the whole site ourselves — from the recipes to the colors you see on screen.",
  },
  {
    id: "how-to-explore",
    question: "How do I explore the dishes?",
    answer:
      "Start with the Local Flavors and International Flavors sections to browse the catalog. Tap any dish card to read its history, ingredients, and preparation. You can also watch the Food Videos section to see some of these dishes being made.",
  },
  {
    id: "flavor-passport",
    question: "What is the Flavor Passport?",
    answer:
      "The Flavor Passport is a fun way to track how many dishes you have explored. Each dish you open earns a stamp, so you can challenge yourself to fill the whole passport as you travel through the menu.",
  },
  {
    id: "leave-review",
    question: "Can I leave a review or suggest a dish?",
    answer:
      "Yes! Use the Reviews section to rate and comment on dishes you have tried, and the Suggestions section to recommend a dish we should add. We read every suggestion and love hearing what you want to see next.",
  },
  {
    id: "is-it-free",
    question: "Is LASA free to use?",
    answer:
      "Completely free. LASA is a non-commercial student project made for learning and for sharing our love of food. There is nothing to buy and no account required to browse.",
  },
  {
    id: "how-to-contact",
    question: "How can I get in touch with the team?",
    answer:
      "Head to the Contact section and send us a message using the form, or reach out through any of our social pages in the Follow Our Food Journey section. We are always happy to hear feedback, questions, or collaboration ideas.",
  },
];
