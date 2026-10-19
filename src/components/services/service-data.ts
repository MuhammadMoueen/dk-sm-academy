export type ServiceFaq = {
  question: string;
  answer: string;
};

export type Service = {
  slug: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  featureLabels?: string[];
  introduction: string;
  faqs: ServiceFaq[];
};

export const services: Service[] = [
  {
    slug: "buy-sell",
    title: "Crypto & USDT Buy/Sell",
    description:
      "Learn how to buy, sell, and exchange crypto and USDT with practical guides, platform information, and essential safety tips.",
    image: "/images/service-buy-sell.png",
    imageAlt: "Cryptocurrency coins with exchange arrows",
    featureLabels: ["Buy Crypto", "Sell USDT", "P2P Guides"],
    introduction:
      "Understand the basic steps involved in buying or selling digital assets. Our educational guides explain common exchange features, transaction checks, and ways to make more informed decisions.",
    faqs: [
      {
        question: "Does DK & SM Academy sell crypto or USDT?",
        answer:
          "This page provides educational information only. It does not execute trades, hold funds, or guarantee access to any exchange or payment method.",
      },
      {
        question: "How do I choose an exchange?",
        answer:
          "Research the provider yourself, including local availability, security practices, fees, supported networks, and its terms. Platform features can change.",
      },
      {
        question: "Can a crypto transfer be reversed?",
        answer:
          "Many blockchain transfers cannot be reversed once confirmed. Carefully check the address, asset, and network before submitting a transfer.",
      },
    ],
  },
  {
    slug: "airdrops",
    title: "Free Verified Airdrops",
    description:
      "Get latest verified airdrop updates with eligibility details and easy participation guides.",
    image: "/images/service-airdrops.png",
    imageAlt: "Airdrop parachute carrying a cryptocurrency coin",
    introduction:
      "Learn how token distributions and airdrop campaigns are commonly structured, what eligibility rules may apply, and how to evaluate an announcement before interacting with it.",
    faqs: [
      {
        question: "Are all airdrops listed by the Academy guaranteed?",
        answer:
          "No. Eligibility, campaign availability, and distributions are controlled by each project and can change. Always verify details at the project’s official source.",
      },
      {
        question: "Should I pay a fee to claim an airdrop?",
        answer:
          "Be cautious of requests for upfront payments, deposits, or sensitive wallet credentials. Research the campaign independently and never disclose a recovery phrase.",
      },
      {
        question: "Why might I not qualify?",
        answer:
          "Projects set their own rules, such as timing, location, activity, or other criteria. The project determines eligibility and any final distribution.",
      },
    ],
  },
  {
    slug: "exchange-campaigns",
    title: "Exchange Campaigns",
    description:
      "Stay updated with verified exchange campaigns, competitions and reward opportunities.",
    image: "/images/service-campaigns.png",
    imageAlt: "Cryptocurrency exchange campaign rewards",
    introduction:
      "Explore how exchange promotions and competitions typically work. Learn to read campaign rules, compare requirements, and consider the risks before deciding whether to take part.",
    faqs: [
      {
        question: "Does the Academy run these exchange campaigns?",
        answer:
          "No. Campaigns are administered by the exchange or provider that publishes the official rules. We provide general educational guidance.",
      },
      {
        question: "Are campaign rewards guaranteed?",
        answer:
          "No. Rewards may depend on eligibility, campaign terms, and the provider’s verification. Confirm the current rules with the provider.",
      },
      {
        question: "Where should I check campaign details?",
        answer:
          "Use the exchange’s official website or verified communication channels. Be alert for copied announcements and impersonation accounts.",
      },
    ],
  },
  {
    slug: "trading",
    title: "Trading & Market Analysis",
    description:
      "Learn trading skills, market analysis, and get current market updates with practical guidance.",
    image: "/images/service-trading.png",
    imageAlt: "Rising market chart and candlesticks",
    introduction:
      "Build a foundation in market terminology, chart reading, and risk awareness. Educational analysis can help you ask better questions, but it cannot predict market outcomes.",
    faqs: [
      {
        question: "Do the market updates predict future prices?",
        answer:
          "No. Market commentary describes information and possible interpretations at a point in time; it cannot reliably predict future prices.",
      },
      {
        question: "Can beginners use these materials?",
        answer:
          "The materials are intended to explain foundational ideas. Learn at your own pace, use simulations where available, and do not risk money you cannot afford to lose.",
      },
      {
        question: "Does the Academy provide trading signals?",
        answer:
          "The Academy’s educational content should not be treated as personalized signals or financial advice. Make independent decisions based on your own circumstances.",
      },
    ],
  },
  {
    slug: "courses",
    title: "Crypto & Social Media Courses",
    description:
      "Access structured courses on crypto, trading, and social media to build your skills step by step.",
    image: "/images/service-courses.png.png",
    imageAlt: "Books and graduation cap representing online courses",
    introduction:
      "Follow a structured path through digital-asset fundamentals, trading concepts, and practical social-media skills. Lessons are designed to support steady learning and independent research.",
    faqs: [
      {
        question: "Do the courses guarantee trading results?",
        answer:
          "No. The courses explain concepts and learning practices; no result, profit, or individual outcome is guaranteed.",
      },
      {
        question: "Do I need prior crypto experience?",
        answer:
          "Foundational topics are included to help learners get oriented. You can progress at a pace that suits your existing knowledge.",
      },
      {
        question: "Are social-media skills covered?",
        answer:
          "The course offering includes structured learning around content planning and responsible social-media use, alongside crypto and trading education.",
      },
    ],
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug);
}
