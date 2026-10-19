export type ServiceFaq = {
  question: string;
  answer: string;
};

export type ServiceContentSection = {
  heading: string;
  introduction: string;
  points: string[];
};

export type Service = {
  slug: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  featureLabels?: string[];
  introduction: string;
  sections: ServiceContentSection[];
  safetyNote: string;
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
    sections: [
      {
        heading: "A careful process, from start to finish",
        introduction:
          "Before placing an order, take time to understand the platform and the transaction details.",
        points: [
          "Compare available platforms, supported assets, fees, and terms independently.",
          "Review the asset, network, amount, quoted price, and recipient details before confirming.",
          "Start by learning with small amounts and keep a record of transaction confirmations.",
        ],
      },
      {
        heading: "What the guides cover",
        introduction:
          "Resources are designed to explain the process rather than recommend a particular asset or service.",
        points: [
          "Common order types, deposits, withdrawals, and wallet basics.",
          "How to check network compatibility and understand displayed fees.",
          "Practical account-security habits, including unique passwords and multi-factor authentication.",
        ],
      },
    ],
    safetyNote:
      "Crypto assets are volatile and transactions may be irreversible. Never share a password, verification code, or recovery phrase, and verify addresses through trusted channels before sending funds. DK & SM Academy does not provide financial, legal, or tax advice.",
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
    sections: [
      {
        heading: "Evaluate an announcement first",
        introduction:
          "A listing or post is not a guarantee that a campaign is legitimate or that a reward will be distributed.",
        points: [
          "Find the campaign through the project’s own verified website or social account.",
          "Read the eligibility, location, deadline, and distribution terms in full.",
          "Check whether participation asks you to connect a wallet, sign a message, or pay a fee.",
        ],
      },
      {
        heading: "Participate with care",
        introduction:
          "Keep control of your accounts and wallet while learning about campaign requirements.",
        points: [
          "Use a separate wallet for experiments and keep only what you can afford to risk there.",
          "Never share recovery phrases or private keys to claim a reward.",
          "Revoke permissions you no longer need and avoid unknown downloads or links.",
        ],
      },
    ],
    safetyNote:
      "Airdrops are not guaranteed income. Fake claim pages and impersonation are common risks; no legitimate support request should require your wallet recovery phrase or private key. Confirm all details directly with the project.",
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
    sections: [
      {
        heading: "Read the campaign terms",
        introduction:
          "Campaign names and reward banners do not explain every condition. Review the full terms published by the exchange.",
        points: [
          "Check the campaign period, eligible regions, account requirements, and any exclusions.",
          "Understand volume, deposit, or trading conditions and how they are measured.",
          "Look for reward limits, distribution timing, and circumstances that may void eligibility.",
        ],
      },
      {
        heading: "Make an informed decision",
        introduction:
          "A promotion should not be a reason to take on risk you would otherwise avoid.",
        points: [
          "Compare potential costs and fees with the campaign’s stated conditions.",
          "Do not trade or deposit more than you can afford to lose.",
          "Contact the exchange through its official support channels if a rule is unclear.",
        ],
      },
    ],
    safetyNote:
      "Campaigns and rewards are managed by their respective providers; availability and terms can change without notice. DK & SM Academy is not an exchange partner and does not promise campaign eligibility or rewards.",
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
    sections: [
      {
        heading: "Build your understanding",
        introduction:
          "A measured learning process starts with concepts and practice rather than promises of quick results.",
        points: [
          "Learn how price charts, time frames, volume, and common indicators are presented.",
          "Study the difference between market, limit, and stop orders before using them.",
          "Practice documenting an idea, its assumptions, and what would invalidate it.",
        ],
      },
      {
        heading: "Put risk awareness first",
        introduction:
          "Markets can move quickly, and losses are possible even when a plan is followed.",
        points: [
          "Learn how position size, leverage, volatility, and fees affect exposure.",
          "Use paper-trading tools to practice without risking real funds.",
          "Avoid relying on a single opinion, signal, or short-term price movement.",
        ],
      },
    ],
    safetyNote:
      "This material is educational, not investment advice or a recommendation to buy or sell. Trading digital assets and leveraged products involves substantial risk, including loss of capital. Past performance does not predict future results.",
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
    sections: [
      {
        heading: "Learn in a clear sequence",
        introduction:
          "Start with core ideas and move toward practical exercises as your understanding develops.",
        points: [
          "Build crypto literacy: wallets, networks, exchanges, and common terminology.",
          "Study market concepts and risk management before exploring analytical tools.",
          "Practice content planning, audience research, and responsible online communication.",
        ],
      },
      {
        heading: "Turn learning into practice",
        introduction:
          "Short exercises can help reinforce concepts without assuming a particular financial outcome.",
        points: [
          "Summarize a lesson in your own words and identify questions to research.",
          "Use a checklist to review a project, source, or piece of online content.",
          "Create a learning plan and revisit earlier topics as your skills grow.",
        ],
      },
    ],
    safetyNote:
      "Course content is educational and does not guarantee employment, audience growth, trading performance, or financial returns. Verify claims independently and protect your account credentials when using online tools.",
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
