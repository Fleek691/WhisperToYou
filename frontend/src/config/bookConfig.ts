/**
 * CENTRALIZED CONTENT CONFIGURATION FOR "WHISPER TO YOU"
 * Update any book information, pricing, shipping, or media assets here.
 */

export interface BookTheme {
  id: string;
  number: string;
  title: string;
  description: string;
}

export interface BookDetails {
  title: string;
  author: string;
  genre: string;
  language: string;
  pages: string;
  dimensions: string;
  format: string;
  isbn: string;
  publisher: string;
  publicationDate: string;
  weight: string;
  price: number;
}

export const BOOK_CONFIG = {
  // Core Information
  BOOK_TITLE: "Whisper to You",
  AUTHOR_NAME: "Ladup Sherpa",
  
  // Media Assets
  BOOK_COVER: "/images/book-cover.png",
  POEM_PREVIEWS: [
    {
      id: "preview-1",
      title: "Craving What I Fear",
      image: "/images/poem-preview-1.jpg",
      alt: "Poem excerpt 'Craving What I Fear' from Whisper to You"
    },
    {
      id: "preview-2",
      title: "Inkborne Death",
      image: "/images/poem-preview-2.jpg",
      alt: "Poem excerpt 'Inkborne Death' from Whisper to You"
    },
    {
      id: "preview-3",
      title: "The Painting of You",
      image: "/images/poem-preview-3.jpg",
      alt: "Poem excerpt 'The Painting of You' from Whisper to You"
    }
  ],
  
  // Pricing & Shipping Configuration
  BOOK_PRICE: 5, // ₹ INR
  LOCAL_SHIPPING_CHARGE: 0, // ₹ INR (West Bengal)
  NATIONAL_SHIPPING_CHARGE: 0, // ₹ INR (Other States)
  FREE_SHIPPING_THRESHOLD: 999, // ₹ INR (Free shipping if subtotal >= 999)
  
  // Epigraph & Literary Content
  EPIGRAPH: "What we lose does not leave; it waits.",
  INTRODUCTION: "WHISPER TO YOU emerged gradually from poems written in moments of reflection rather than intention. What began as isolated lines became, over time, a coherent meditation on love, absence, and personal accountability.",
  DESCRIPTION: "These poems do not seek resolution or reconciliation. They acknowledge the persistence of memory, the weight of regret, and the quiet ways in which love may endure after it has lost its place in one's life. The voice within these pages is neither pleading nor absolved—it observes, remembers, and accepts.",
  SUMMARY: "If these poems resonate, it is because loss is a shared human experience, though its details are always individual. This work is offered not as explanation, but as witness.",
  
  // Themes
  THEMES: [
    {
      id: "theme-1",
      number: "01",
      title: "Love",
      description: "A meditation on the quiet ways in which love may endure long after it has lost its place in one's life."
    },
    {
      id: "theme-2",
      number: "02",
      title: "Loss",
      description: "Acknowledging the weight of absence and the lingering silence left behind when connection fades."
    },
    {
      id: "theme-3",
      number: "03",
      title: "Grief",
      description: "Exploring raw, melancholic expression—neither pleading nor absolved, offered purely as witness."
    },
    {
      id: "theme-4",
      number: "04",
      title: "Longing",
      description: "Capturing unspoken thoughts and feelings before they fade into distance."
    },
    {
      id: "theme-5",
      number: "05",
      title: "Memories",
      description: "Preserving moments without a picture, using ink to say what ordinary words cannot."
    },
    {
      id: "theme-6",
      number: "06",
      title: "Healing",
      description: "Finding a quiet space for self-expression, personal accountability, and eventual acceptance."
    }
  ] as BookTheme[],

  // Editorial Specification Details
  SPECIFICATIONS: {
    title: "Whisper to You",
    author: "Ladup Sherpa",
    genre: "Poetry & Meditation",
    language: "English",
    pages: "58",
    dimensions: "A5",
    format: "Hardcover",
    isbn: "First Edition",
    publisher: "Ladup Sherpa",
    publicationDate: "2024",
    weight: "250g",
    price: 10
  } as BookDetails,

  // Shipping & Policy
  SHIPPING: {
    locations: "All Across India",
    processingTime: "1 - 2 Business Days",
    estimatedDelivery: "3 - 7 Business Days",
    shippingCharge: "₹80 within West Bengal, ₹100 for other states (Free on orders above ₹999)",
    freeShipping: "Orders above ₹999",
    tracking: "Tracking link provided via Email upon dispatch",
    returns: "Replacement guaranteed for damaged or defective copies upon delivery"
  },

  // Author & Contact Information
  AUTHOR_BIO: "As a young graduate who writes poetry as a personal pursuit, I found a quiet space for reflection and self-expression in poetry. What began as a way to give words to thoughts and feelings that often remained unspoken gradually became a deeper exploration of love, loss, loneliness, memory, longing, and the complexities of human emotions.\n\nMy writing is deeply personal, often drawn from emotions, experiences, the stories that I heard, and moments that leave lasting impressions. With a preference for raw and melancholic expression, the poems explore both the beauty and darker sides of human connection. For me, poetry is not about having all the answers. It is about capturing a feeling before it fades, preserving a moment without a picture, and saying what ordinary words sometimes cannot.\n\nThis book is a reflection of that journey—a collection of emotions once carried quietly, now printed in pages.",
  PERSONAL_NOTE: "This book isn't just a book. It's a piece of my life I decided to let strangers hold.",
  SPECIAL_TOUCH: "Every copy is packed by me, no warehouse, no mass production, packed carefully and sent from my hands to yours.",
  INSTAGRAM_URL: "https://instagram.com/_.fixion.03._",
  CONTACT_EMAIL: "ladupsherpa333@gmail.com",
};

