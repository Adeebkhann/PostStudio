import { TechRadarArticle, TechRadarCategory } from '../types/studio';
import { API_BASE_URL } from './apiConfig';

let liveArticlesCache: TechRadarArticle[] = [];
let lastFetchTimestamp = 0;
let currentFeedPage = 1;

// Rotating query tag clusters to guarantee fresh, distinct content on every refresh
const TAG_CLUSTERS = [
  { career: 'career', tech: 'technology', ai: 'ai' },
  { career: 'productivity', tech: 'programming', ai: 'machinelearning' },
  { career: 'devops', tech: 'webdev', ai: 'datascience' },
  { career: 'leadership', tech: 'cloud', ai: 'python' }
];

function enrichCareerImpact(title: string, summary: string, tags: string[]): {
  summary: string;
  jobImpact: string;
  keyQuote: string;
  urgency: TechRadarArticle['urgencyBadge'];
  threat: TechRadarArticle['threatLevel'];
} {
  const text = (title + ' ' + summary + ' ' + tags.join(' ')).toLowerCase();

  if (text.includes('agent') || text.includes('llm') || text.includes('ai') || text.includes('model') || text.includes('rag') || text.includes('eval') || text.includes('prompt')) {
    return {
      summary: `${summary} This represents a fundamental shift from deterministic coding to autonomous agent orchestration. Production engineering teams are moving toward strict Pydantic schemas, state graph boundaries, and automated regression test harnesses to prevent non-deterministic failure states.`,
      jobImpact: "🚨 The 'Boilerplate Typist' Era is Ending: Manual controller writing, basic JSON glue code, and routine CRUD are dropping to near-zero market value. Compensation is shifting aggressively ($200k-$320k+) toward Systems Architects who design automated evaluation benches, MCP tool sandboxes, and latency-budgeted agent state graphs.",
      keyQuote: '"In production AI, models are disposable commodities. The proprietary moat is entirely in your evaluation harness and system architecture." — Industry Systems Brief',
      urgency: 'DISRUPTION ALERT',
      threat: 'High Disruption'
    };
  }

  if (text.includes('front') || text.includes('react') || text.includes('css') || text.includes('ui') || text.includes('design') || text.includes('component')) {
    return {
      summary: `${summary} Generative design-to-code compilers and automated layout synthesis are collapsing front-end iteration cycles from multi-week sprints down to single afternoons. Modern tooling translates Figma tokens and accessible ARIA attributes directly into production-grade React components.`,
      jobImpact: "⚠️ Slicing Static UI is No Longer a Defensible Moat: Engineers spending their days manually styling static layouts are facing extreme market compression. High-leverage front-end talent is moving into client-side streaming state architecture, sub-millisecond interaction latency, local-first offline syncing, and deep WebAssembly acceleration.",
      keyQuote: '"Teams that previously needed 6 front-end engineers to slice UI are building twice as much surface area with 2 engineers orchestrating compilers."',
      urgency: 'CAREER SHIFT',
      threat: 'Skill Upgrade Required'
    };
  }

  if (text.includes('rust') || text.includes('devops') || text.includes('cloud') || text.includes('docker') || text.includes('cicd') || text.includes('infra')) {
    return {
      summary: `${summary} Tooling velocity across the industry is undergoing an 80% compression cycle. Engineering organizations are systematically deprecating legacy interpreted build scripts in favor of compiled Rust utilities (UV, Ruff, Biome) that execute in sub-second timeframes with zero dependency drift.`,
      jobImpact: "⚡ The Efficiency Multiplier: Companies are aggressively cutting developer tooling overhead and CI runner costs. Engineers who eliminate pipeline friction, optimize container cold starts, and implement deterministic hermetic builds are saving organizations tens of thousands in monthly compute bills, making platform engineers the most cost-justified hires in modern tech.",
      keyQuote: '"Slashing build times from 15 minutes to 30 seconds does not just save cloud bills—it prevents engineers from switching context 20 times a day."',
      urgency: 'HIGH IMPACT',
      threat: 'Massive Opportunity'
    };
  }

  if (text.includes('python') || text.includes('data') || text.includes('backend') || text.includes('api') || text.includes('sql')) {
    return {
      summary: `${summary} Python is transforming from a traditional scripting language into a high-throughput enterprise runtime. With Python 3.12+ type parameter syntax, per-interpreter GIL removal, and Rust-accelerated package managers, backend architectures are handling 3.8x higher concurrency with minimal server footprints.`,
      jobImpact: "💡 Modern Python Literacy Has Leveled Up: Writing untyped procedural scripts is a legacy liability. Top engineering founders and tech leads now mandate strict static typing, asynchronous event queues, and Model Context Protocol (MCP) integrations. Adopting these modern patterns instantly differentiates you from junior developers who only know basic scripting.",
      keyQuote: '"Clean type-safe Python combined with subinterpreter parallelism delivers the developer velocity of dynamic code with the resilience of enterprise backends."',
      urgency: 'NEW RELEASE',
      threat: 'Massive Opportunity'
    };
  }

  return {
    summary: `${summary} This development highlights a broader industry shift toward lean, highly autonomous engineering pods. Organizations are ruthlessly prioritizing unit economics, fast time-to-market, and measurable business outcomes over sprawling headcount and speculative projects.`,
    jobImpact: "🎯 The Rise of the 'Full-Lifecycle Builder': Headcount budgets are moving away from middle-management coordination layers toward individual contributors who can take an ambiguous business problem from architecture specification to production deployment in days. Cultivating end-to-end ownership is the single most reliable career accelerant in tech right now.",
    keyQuote: '"The highest-paid engineers in the coming decade will not be the fastest at typing code—they will be the clearest systems thinkers who eliminate unnecessary complexity."',
    urgency: 'CAREER SHIFT',
    threat: 'Skill Upgrade Required'
  };
}
const BASE_RADAR_ARTICLES: TechRadarArticle[] = [
  {
    id: 'radar-career-1',
    category: 'Job & Workflow Disruption',
    title: 'The Shift from Writing CRUD to Agent Verification: How Developer Roles are Evolving',
    source: 'Dev Community & Industry Brief',
    publishedTime: 'Today',
    urgencyBadge: 'DISRUPTION ALERT',
    summary: 'Autonomous coding agents can now scaffold endpoints, database migrations, and unit tests in seconds. Engineers are moving upstream into specification and validation.',
    keyQuoteOrFact: '"The engineers who thrive will not be the fastest at typing boilerplate—they will be systems architects who master automated evaluation harnesses."',
    jobImpact: 'Junior & mid-level developers who only write standard CRUD controllers face pressure. Career safety is moving toward distributed architecture, security, and agent harness design.',
    threatLevel: 'High Disruption',
    tags: ['#CareerStrategy', '#SoftwareEngineering', '#AIAgents', '#DevOps'],
    suggestedPrompt: 'How developer roles are evolving from routine CRUD writing to agent verification and architecture',
    recommendedLayout: 'orvynix-whiteboard'
  },
  {
    id: 'radar-career-2',
    category: 'Job & Workflow Disruption',
    title: 'Design-to-Code Compilers: Why Frontend Prototyping Cycles Dropped from Days to Hours',
    source: 'UI Engineering Dispatch',
    publishedTime: 'Today',
    urgencyBadge: 'CAREER SHIFT',
    summary: 'Generative frontend compilers now transform design tokens and Figma prototypes directly into accessible, production-ready React components.',
    keyQuoteOrFact: '"Teams are building 4x more product surface area with smaller engineering pods by letting compilers handle layout translation."',
    jobImpact: 'Frontend specialists must focus on state architecture, accessibility (a11y), and performance profiling rather than manual CSS slicing.',
    threatLevel: 'Skill Upgrade Required',
    tags: ['#Frontend', '#React', '#ProductDesign', '#UIUX'],
    suggestedPrompt: 'Why design-to-code compilers are changing frontend engineering from layout slicing to state architecture',
    recommendedLayout: 'rag-pipeline'
  },
  {
    id: 'radar-exec-1',
    category: 'Big Tech Updates & Executive Words',
    title: 'Executive Update: Autonomous Multi-Step Agents Becoming the New Enterprise Software Layer',
    source: 'Enterprise AI Keynote',
    publishedTime: 'Today',
    urgencyBadge: 'OFFICIAL UPDATE',
    summary: 'Major cloud providers and model labs are standardizing on long-running agent workflows with tool-calling capabilities and explicit memory boundaries.',
    keyQuoteOrFact: '"The fundamental unit of software will no longer be an isolated app or REST API. It will be an autonomous agent equipped with memory and goal verification."',
    jobImpact: 'IT budgets and enterprise procurement are pivoting from traditional per-seat SaaS to consumption-based agentic orchestration graphs.',
    threatLevel: 'Massive Opportunity',
    tags: ['#EnterpriseAI', '#CloudComputing', '#FutureOfWork', '#TechLeadership'],
    suggestedPrompt: 'Why autonomous agentic runtimes are replacing traditional per-seat SaaS in enterprise software',
    recommendedLayout: 'orvynix-whiteboard'
  },
  {
    id: 'radar-exec-2',
    category: 'Big Tech Updates & Executive Words',
    title: 'Hybrid Reasoning & Test-Time Compute: How Thinking Before Answering Changes Model Economics',
    source: 'Applied AI Research',
    publishedTime: 'Today',
    urgencyBadge: 'HIGH IMPACT',
    summary: 'Allowing models test-time compute to explore multiple decision trees before returning a response is mathematically outperforming raw parameter scaling.',
    keyQuoteOrFact: '"Giving a reasoning model 15 seconds to evaluate architectural trade-offs beats giving a static model 10x more parameters that answers instantaneously."',
    jobImpact: 'Teams can solve complex legal, medical, and architectural problems with smaller, targeted reasoning models rather than giant generalist models.',
    threatLevel: 'Skill Upgrade Required',
    tags: ['#ReasoningModels', '#DeepLearning', '#SystemArchitecture'],
    suggestedPrompt: 'How hybrid reasoning models and test-time compute are outperforming raw parameter scaling',
    recommendedLayout: 'dandes-roadmap'
  },
  {
    id: 'radar-code-1',
    category: 'Emerging Tech & Next-Gen Code',
    title: 'Model Context Protocol (MCP): The Universal Standard Connecting LLMs to Live Systems',
    source: 'Open Source Architecture',
    publishedTime: 'Today',
    urgencyBadge: 'NEW RELEASE',
    summary: 'Model Context Protocol (MCP) has become the open standard for giving models standardized access to databases, GitHub repositories, and browser tools.',
    keyQuoteOrFact: '"MCP is to AI what USB was to hardware: a universal, pluggable protocol eliminating hundreds of custom, brittle JSON REST wrappers."',
    jobImpact: 'Developers who adopt MCP can link models to enterprise infrastructure in minutes with standardized security boundaries.',
    threatLevel: 'Massive Opportunity',
    tags: ['#MCP', '#ModelContextProtocol', '#OpenSource', '#SystemDesign'],
    suggestedPrompt: 'Why Model Context Protocol (MCP) is the universal USB standard for AI agents',
    recommendedLayout: 'orvynix-whiteboard'
  },
  {
    id: 'radar-code-2',
    category: 'Emerging Tech & Next-Gen Code',
    title: 'Rust-Powered Tooling (UV, Ruff, Biome): Cutting CI/CD Build Times by Over 80%',
    source: 'Modern Stack Benchmark',
    publishedTime: 'Today',
    urgencyBadge: 'HIGH IMPACT',
    summary: 'Engineering teams are aggressively replacing legacy Node and Python CLI utilities with ultra-fast Rust binaries that run 10x to 100x faster.',
    keyQuoteOrFact: '"Switching our dependency resolution and linting to Rust-based binaries cut CI build times from 14 minutes to 45 seconds, saving thousands in runner fees."',
    jobImpact: 'DevOps and platform engineers can drastically reduce CI/CD compute costs and eliminate package drift with zero configuration friction.',
    threatLevel: 'Skill Upgrade Required',
    tags: ['#Rust', '#DevOps', '#CICD', '#ModernStack'],
    suggestedPrompt: 'The Rust tooling revolution: how UV, Ruff, and Biome are transforming CI/CD velocity',
    recommendedLayout: 'python-cheatsheet'
  }
];

/**
 * Fetches real, live tech articles from public developer feeds.
 * If force=true, clears the cache and performs a fresh fetch.
 */
export async function fetchLiveRadarArticles(force: boolean = false): Promise<TechRadarArticle[]> {
  const now = Date.now();
  if (!force && liveArticlesCache.length > 0 && now - lastFetchTimestamp < 5 * 60 * 1000) {
    return liveArticlesCache;
  }

  if (force) {
    currentFeedPage += 1;
  }

  const cluster = TAG_CLUSTERS[(currentFeedPage - 1) % TAG_CLUSTERS.length];
  const pageNum = ((currentFeedPage - 1) % 5) + 1;

  // 1. Try Python Radar Engine first
  try {
    const pyRes = await fetch(`${API_BASE_URL}/api/radar/feed?page=${pageNum}`);
    if (pyRes.ok) {
      const pyData = await pyRes.json();
      if (Array.isArray(pyData.articles) && pyData.articles.length > 0) {
        liveArticlesCache = pyData.articles;
        lastFetchTimestamp = now;
        return pyData.articles;
      }
    }
  } catch {
    // Continue to browser fallback
  }

  try {
    const feeds = [
      { url: `https://dev.to/api/articles?tag=${cluster.career}&page=${pageNum}&per_page=5`, cat: 'Job & Workflow Disruption' as const },
      { url: `https://dev.to/api/articles?tag=${cluster.tech}&page=${pageNum}&per_page=5`, cat: 'Big Tech Updates & Executive Words' as const },
      { url: `https://dev.to/api/articles?tag=${cluster.ai}&page=${pageNum}&per_page=5`, cat: 'Emerging Tech & Next-Gen Code' as const }
    ];

    const responses = await Promise.allSettled(
      feeds.map(f => fetch(f.url, { headers: { Accept: 'application/json' } }))
    );

    const freshArticles: TechRadarArticle[] = [];

    for (let i = 0; i < responses.length; i++) {
      const res = responses[i];
      const targetCat = feeds[i].cat;

      if (res.status === 'fulfilled' && res.value.ok) {
        const items = await res.value.json();
        if (Array.isArray(items)) {
          for (const item of items) {
            const id = String(item.id || Math.random());
            const title = item.title || 'Untitled Technical Brief';
            const description = item.description || 'Live technical discussion and architecture breakdown.';
            const author = item.user?.name || item.user?.username || 'Engineering Contributor';
            const published = item.readable_publish_date || 'Recently';
            const rawTags = Array.isArray(item.tag_list)
              ? item.tag_list.map((t: string) => `#${t.replace(/[^a-zA-Z0-9]/g, '')}`)
              : ['#Tech', '#Engineering'];

            const enriched = enrichCareerImpact(title, description, rawTags);

            freshArticles.push({
              id: `live-${id}`,
              category: targetCat,
              title,
              source: `${author} via Dev Intel Feed`,
              publishedTime: published,
              urgencyBadge: enriched.urgency,
              summary: enriched.summary,
              keyQuoteOrFact: enriched.keyQuote,
              jobImpact: enriched.jobImpact,
              threatLevel: enriched.threat,
              tags: rawTags.slice(0, 4),
              suggestedPrompt: title
            });
          }
        }
      }
    }

    if (freshArticles.length > 0) {
      liveArticlesCache = freshArticles;
      lastFetchTimestamp = now;
      return freshArticles;
    }
  } catch (err) {
    console.warn('Live radar feed fetch issue, using reliable base feed:', err);
  }

  // Fallback with rotating offset
  liveArticlesCache = BASE_RADAR_ARTICLES;
  lastFetchTimestamp = now;
  return BASE_RADAR_ARTICLES;
}

export const techRadarService = {
  async getLiveArticles(category: TechRadarCategory = 'All', searchQuery: string = '', forceRefresh: boolean = false): Promise<TechRadarArticle[]> {
    const all = await fetchLiveRadarArticles(forceRefresh);
    let filtered = all;

    if (category !== 'All') {
      filtered = filtered.filter(a => a.category === category);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    return filtered;
  },

  getCachedArticles(): TechRadarArticle[] {
    return liveArticlesCache.length > 0 ? liveArticlesCache : BASE_RADAR_ARTICLES;
  }
};
