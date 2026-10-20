import { TrendingLinkedInPost } from '../types/studio';

export const TRENDING_POSTS_CATALOG: TrendingLinkedInPost[] = [
  // Engineering & Tech
  {
    id: 'trend-tech-1',
    author: 'Alexandre Renard',
    authorTitle: 'Principal Systems Architect @ Scale Labs',
    category: 'Engineering & Tech',
    hook: '90% of production RAG failures have nothing to do with the LLM. It’s chunking and metadata hygiene.',
    fullText: `90% of RAG failures have nothing to do with the LLM.\n\nIt’s almost always chunking and metadata hygiene.\n\nHere is how production retrieval actually works:\n\n1. Ingestion: Don't split by blind character counts. Split by semantic markdown headers and tables.\n2. Hybrid Search: Vector embedding cosine similarity + BM25 keyword search is mandatory.\n3. Reranking: Always run a cross-encoder reranker on top 25 chunks.\n4. Context Compression: Strip boilerplate headers before LLM ingestion.\n\nStop blaming the model when your retrieval is dirty.`,
    likes: '4,820',
    comments: '412',
    tags: ['#RAG', '#GenerativeAI', '#LLM', '#SystemDesign'],
    suggestedPrompt: 'How production RAG architecture actually works (hybrid search + reranking)',
    visualType: 'Diagram'
  },
  {
    id: 'trend-tech-2',
    author: 'Sarah Chen, PhD',
    authorTitle: 'Senior Data Infrastructure Lead',
    category: 'Engineering & Tech',
    hook: 'Python 3.12 Cheatsheet: The 5 performance features that made us rewrite our pipeline.',
    fullText: `Python 3.12 Cheatsheet: The 5 performance features that made us rewrite our pipeline.\n\n1. Type Parameter Syntax (PEP 695): Cleaner generic syntax without TypeVar.\n2. F-string freedom (PEP 701): Full quotes and backslashes inside expressions.\n3. Subinterpreters (PEP 684): Per-interpreter GIL for true parallel multicore CPU concurrency.\n4. Low-overhead Profiling & Better Error Tracebacks.\n5. Comprehension Inlining for 2x faster dict/list builds.\n\nStop writing Python like it is still 2018.`,
    likes: '6,140',
    comments: '589',
    tags: ['#Python', '#Coding', '#SoftwareEngineering', '#DataScience'],
    suggestedPrompt: 'Python 3.12 cheatsheet and 5 modern syntax upgrades',
    visualType: 'Cheatsheet'
  },
  {
    id: 'trend-tech-3',
    author: 'Marcus Vance',
    authorTitle: 'Chief Software Architect',
    category: 'Engineering & Tech',
    hook: 'System Design in 2026: Why modular monoliths are quietly beating microservices.',
    fullText: `Why modular monoliths are quietly beating microservices for 95% of engineering teams:\n\n1. Network latency between microservices kills user experience.\n2. Distributed transactions and saga patterns create maintenance hell.\n3. Single deployable unit + strict domain module boundaries gives 80% of microservice benefits with 10% of the overhead.\n\nMicroservices are an organizational scaling tool for 1,000 engineers, not a technical badge of honor for a team of 15.`,
    likes: '7,320',
    comments: '891',
    tags: ['#SystemDesign', '#Architecture', '#DevOps', '#Engineering'],
    suggestedPrompt: 'Modular Monolith vs Microservices: the 2026 engineering reality',
    visualType: 'Infographic'
  },

  // Marketing & Growth
  {
    id: 'trend-growth-1',
    author: 'Camilla Torres',
    authorTitle: 'VP of Growth & Retention',
    category: 'Marketing & Growth',
    hook: 'Acquisition is vanity. Retention is sanity. Why your CAC is burning your startup.',
    fullText: `If your 90-day retention curve doesn't flatten, pouring more money into Facebook or LinkedIn ads is just subsidizing your churn.\n\nHere is how we doubled our LTV in 6 months:\n\n1. Time-to-Value under 3 minutes (eliminate multi-step onboarding forms).\n2. Automated churn trigger: if a user is inactive for 7 days, trigger a human check-in, not an automated newsletter.\n3. Upsell only after the customer has realized measurable ROI.\n\nGrowth isn't a top-of-funnel game anymore. It's a product-usage game.`,
    likes: '5,940',
    comments: '468',
    tags: ['#GrowthMarketing', '#SaaS', '#Retention', '#ProductLedGrowth'],
    suggestedPrompt: 'Why retention is the only real growth metric that matters in B2B',
    visualType: 'Infographic'
  },
  {
    id: 'trend-growth-2',
    author: 'David Sterling',
    authorTitle: 'B2B Brand & Content Strategist',
    category: 'Marketing & Growth',
    hook: 'Zero-Click Content is winning LinkedIn. Stop posting links in your copy.',
    fullText: `The era of "click this link to read our whitepaper" is completely dead.\n\nLinkedIn's algorithm penalizes external outbound links by up to 60%.\n\nGive away the entire punchline directly in the post:\n— Teach the framework in the copy.\n— Put the visual diagram in the carousel.\n— If they want the template, invite them to comment or DM.\n\nRespect the feed. The reach follows the value.`,
    likes: '8,410',
    comments: '912',
    tags: ['#ContentMarketing', '#SocialSelling', '#PersonalBranding', '#B2B'],
    suggestedPrompt: 'The zero-click content strategy that generated 2M impressions',
    visualType: 'Story'
  },

  // Leadership & Startups
  {
    id: 'trend-lead-1',
    author: 'Elena Rostova',
    authorTitle: 'Founder & CEO @ Horizon AI',
    category: 'Leadership & Startups',
    hook: 'Junior leaders ask: "How do we move faster?" Senior leaders ask: "Why are we doing this at all?"',
    fullText: `The most productive code or feature in your company is the one you convinced leadership NOT to build.\n\nSpeed without direction is just accelerated failure.\n\n3 questions every manager should ask on Monday:\n1. What are we doing this week that our customers never asked for?\n2. What is our single top priority, and does everyone know it?\n3. If we cut our roadmap in half, what survives?\n\nRuthless subtraction is the real superpower.`,
    likes: '12,490',
    comments: '1,120',
    tags: ['#Leadership', '#Management', '#Startups', '#Culture'],
    suggestedPrompt: 'Why executive leadership is about subtraction, not addition',
    visualType: 'Story'
  },
  {
    id: 'trend-lead-2',
    author: 'Jonathan Hayes',
    authorTitle: 'Venture Partner & Ex-Operator',
    category: 'Leadership & Startups',
    hook: 'Bootstrapping to $1M ARR vs Raising VC: The numbers nobody shows you.',
    fullText: `Before you sign that term sheet, look at the math:\n\nA bootstrapped founder owning 100% of a \$2M business netting 35% profit takes home \$700k/year in distributions.\n\nA venture-backed founder owning 18% after Series B needs a \$50M exit to walk away with life-changing money, with a 90% chance of getting washed out by liquidation preferences.\n\nRaising money is selling equity to buy speed. If you don't need speed to win your niche, protect your cap table.`,
    likes: '14,200',
    comments: '1,450',
    tags: ['#Bootstrapping', '#VentureCapital', '#Startups', '#Founders'],
    suggestedPrompt: 'The unglamorous truth about bootstrapping vs taking venture capital',
    visualType: 'Infographic'
  },

  // Product & Design
  {
    id: 'trend-prod-1',
    author: 'Maya Lin',
    authorTitle: 'VP of Product Experience',
    category: 'Product & Design',
    hook: 'Good design is obvious. Great design is invisible. Why we deleted 40% of our UI.',
    fullText: `Every button you add to your interface is a tax on user attention.\n\nLast quarter, we ran an experiment:\nInstead of adding new features to increase engagement, we audited every screen and removed 40% of the secondary settings.\n\nThe result?\nActivation rate jumped 32%.\nSupport tickets dropped 48%.\n\nYour users don't want a Swiss Army knife. They want a sharp scalpel.`,
    likes: '6,890',
    comments: '530',
    tags: ['#ProductDesign', '#UX', '#UserExperience', '#DesignSystems'],
    suggestedPrompt: 'How deleting 40% of our UI boosted product conversion by 32%',
    visualType: 'Diagram'
  }
];

export const trendingFeedService = {
  getTrendingPosts(category?: string, searchQuery?: string, shuffle?: boolean): TrendingLinkedInPost[] {
    let posts = [...TRENDING_POSTS_CATALOG];

    if (category && category !== 'All') {
      posts = posts.filter(p => p.category === category);
    }

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      posts = posts.filter(p => 
        p.hook.toLowerCase().includes(q) || 
        p.fullText.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        p.author.toLowerCase().includes(q)
      );
    }

    if (shuffle) {
      posts = posts.sort(() => 0.5 - Math.random());
    }

    return posts;
  }
};
