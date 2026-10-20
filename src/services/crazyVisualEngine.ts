import { VisualArtwork, VisualStyle } from '../types/studio';

export interface RenderOptions {
  thought: string;
  role: string;
  style?: VisualStyle;
  customHeadline?: string;
  customSubtitle?: string;
  customBadge?: string;
  paletteTheme?: 'sage' | 'dark' | 'amber' | 'light' | 'indigo';
}

/**
 * Detects if the user's thought is a technical topic like RAG, Python, System Design, or Cheatsheet
 */
export function getTopicStages(thought: string): { title: string; bullets: string[]; formula: string }[] {
  const t = thought.toLowerCase();

  if (t.includes('job') || t.includes('replac') || t.includes('career') || t.includes('automate') || t.includes('crud')) {
    return [
      {
        title: 'Legacy Manual Task',
        bullets: ['• Repetitive boilerplate code', '• Slow manual ticket slicing', '• Fragile procedural glue code'],
        formula: 'legacy_cost = manual_hours * $120'
      },
      {
        title: 'Agentic Compiler',
        bullets: ['• Natural language to code', '• Automated schema migration', '• Zero-friction unit test generation'],
        formula: 'synthesized = Agent(spec)'
      },
      {
        title: 'Human Verification',
        bullets: ['• Security & boundary audits', '• Distributed systems review', '• Edge case integration testing'],
        formula: 'assert verify(synthesized) == True'
      },
      {
        title: 'Architectural Value',
        bullets: ['• 5x faster feature velocity', '• Focus on core business logic', '• Scalable system durability'],
        formula: 'ROI = 5x velocity / unit_cost'
      }
    ];
  }

  if (t.includes('python') || t.includes('code') || t.includes('rust') || t.includes('syntax') || t.includes('dev')) {
    return [
      {
        title: 'Modern Syntax',
        bullets: ['• Type parameters & clean generics', '• Unrestricted f-string expressions', '• Strict static analysis typing'],
        formula: 'type Model[T] = Record[T, int]'
      },
      {
        title: 'Fast Runtime Engine',
        bullets: ['• Subinterpreters / No-GIL CPU', '• Per-thread memory heaps', '• Zero-overhead JIT compilation'],
        formula: 'threads = ParallelExec(workers=8)'
      },
      {
        title: 'Tooling Ecosystem',
        bullets: ['• Rust-powered fast binaries', '• Instant package resolution', '• Sub-second CI/CD pipelines'],
        formula: 'uv run --no-cache test_suite'
      },
      {
        title: 'Production Deploy',
        bullets: ['• Minimal container footprint', '• 3.8x higher throughput', '• Predictable latency bounds'],
        formula: 'p99_latency < 12ms'
      }
    ];
  }

  if (t.includes('agent') || t.includes('eval') || t.includes('test') || t.includes('mcp')) {
    return [
      {
        title: 'Protocol & Tool Schemas',
        bullets: ['• Model Context Protocol (MCP)', '• Strict Pydantic parameter types', '• Safe execution sandboxes'],
        formula: 'tools = MCP.discover_servers()'
      },
      {
        title: 'State & Memory Graph',
        bullets: ['• Constrained state machine', '• Multi-turn thread persistence', '• Semantic context pruning'],
        formula: 'state = StateGraph.step(action)'
      },
      {
        title: 'Eval & Guardrails',
        bullets: ['• Golden test set verification', '• Hallucination detection gates', '• Hard token & latency ceilings'],
        formula: 'confidence >= 0.95'
      },
      {
        title: 'Production Telemetry',
        bullets: ['• Full trace replay logging', '• Automated regression alerts', '• Human-in-the-loop fallback'],
        formula: 'Telemetry.track(trace_id)'
      }
    ];
  }

  // Default: Universal High-Density Engineering Architecture
  return [
    {
      title: 'Strategic Foundation',
      bullets: [`• Deconstruct ${thought.slice(0, 24)}...`, '• High-contrast boundary design', '• Eliminate single points of failure'],
      formula: 'foundation = Architecture.define()'
    },
    {
      title: 'Core Engine Logic',
      bullets: ['• Deterministic data processing', '• Low-latency event streaming', '• Modular decoupled components'],
      formula: 'pipeline = Stream(event_queue)'
    },
    {
      title: 'Quality Verification',
      bullets: ['• Continuous automated testing', '• Edge-case regression suites', '• Real-time constraint checks'],
      formula: 'status = VerifyAll(components)'
    },
    {
      title: 'Scale & Durability',
      bullets: ['• Unit economic optimization', '• Zero-downtime rolling deploys', '• Long-term architectural moat'],
      formula: 'resilience = 99.99% uptime'
    }
  ];
}

export function escapeXml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function detectRecommendedStyle(thought: string): VisualStyle {
  const t = thought.toLowerCase();
  if (t.includes('cheatsheet') || t.includes('python') || t.includes('syntax') || t.includes('javascript') || t.includes('code') || t.includes('tips') || t.includes('rust')) {
    return 'cheatsheet';
  }
  if (t.includes('vs') || t.includes('replace') || t.includes('instead') || t.includes('mistake') || t.includes('amateur') || t.includes('bad') || t.includes('difference') || t.includes('compare')) {
    return 'comparison';
  }
  if (t.includes('rag') || t.includes('retrieval') || t.includes('architecture') || t.includes('pipeline') || t.includes('system design') || t.includes('how it works') || t.includes('workflow')) {
    return 'infographic';
  }
  if (t.includes('future') || t.includes('leader') || t.includes('story') || t.includes('vision') || t.includes('mindset') || t.includes('scale')) {
    return 'flux-cinematic';
  }
  return 'editorial-3d';
}

/**
 * Renders a crisp, high-resolution 1200x675 vector SVG for technical diagrams, cheatsheets, and infographics.
 */
export function renderVectorCard(options: RenderOptions): string {
  const { thought, role, style = 'infographic', customHeadline, customSubtitle, customBadge, paletteTheme = 'sage' } = options;

  const rawHeadline = customHeadline || (thought.trim().length > 0 
    ? (thought.length > 42 ? thought.substring(0, 42) + '...' : thought)
    : 'System Architecture Blueprint');

  const headline = escapeXml(rawHeadline);
  const subtitle = escapeXml(customSubtitle || 'A visual technical breakdown for modern engineering teams.');
  const badge = escapeXml(customBadge || (
    style === 'cheatsheet' ? 'CHEATSHEET' :
    style === 'comparison' ? 'PARADIGM SHIFT' :
    style === 'editorial-3d' ? 'EXECUTIVE BRIEF' :
    style === 'flux-cinematic' ? 'INDUSTRY IMPACT' : 'SYSTEM ARCHITECTURE'
  ));

  const palettes = {
    sage: {
      bg: '#112117',
      card: '#193324',
      border: '#294F39',
      accent: '#4ADE80',
      accent2: '#A7F3D0',
      text: '#FFFFFF',
      subtext: '#A3C4B2'
    },
    dark: {
      bg: '#0A0F1D',
      card: '#141D30',
      border: '#24324D',
      accent: '#38BDF8',
      accent2: '#818CF8',
      text: '#FFFFFF',
      subtext: '#94A3B8'
    },
    light: {
      bg: '#F8F9F5',
      card: '#FFFFFF',
      border: '#E2E8DE',
      accent: '#2F6B52',
      accent2: '#0F172A',
      text: '#111827',
      subtext: '#4B5563'
    },
    amber: {
      bg: '#18181B',
      card: '#27272A',
      border: '#3F3F46',
      accent: '#F59E0B',
      accent2: '#FDE68A',
      text: '#FFFFFF',
      subtext: '#D4D4D8'
    },
    indigo: {
      bg: '#0F0E17',
      card: '#1E1B2E',
      border: '#353054',
      accent: '#818CF8',
      accent2: '#C084FC',
      text: '#FFFFFF',
      subtext: '#A5B4FC'
    }
  };

  const p = palettes[paletteTheme] || palettes.sage;
  const rawStages = getTopicStages(thought);
  const stages = rawStages.map(s => ({
    title: escapeXml(s.title),
    bullets: s.bullets.map(b => escapeXml(b)),
    formula: escapeXml(s.formula)
  }));

  // ==========================================
  // STYLE 1: EDITORIAL LIGHT / AUTHORITY CARD
  // ==========================================
  if (style === 'editorial-3d') {
    return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675">
  <rect width="1200" height="675" fill="#FAF9F5"/>
  
  <!-- Subtle warm texture lines -->
  <line x1="80" y1="150" x2="1120" y2="150" stroke="#E5E7EB" stroke-width="1.5"/>
  <line x1="80" y1="580" x2="1120" y2="580" stroke="#E5E7EB" stroke-width="1.5"/>

  <!-- Top Executive Header -->
  <g transform="translate(80, 50)">
    <rect x="0" y="0" width="160" height="30" rx="15" fill="#E8F5E9" stroke="#81C784"/>
    <circle cx="15" cy="15" r="4.5" fill="#2E7D32"/>
    <text x="28" y="19" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="800" fill="#2E7D32" letter-spacing="1.2">${badge}</text>

    <text x="0" y="68" font-family="'Plus Jakarta Sans', sans-serif" font-size="34" font-weight="800" fill="#0F172A" letter-spacing="-0.5">${headline}</text>
  </g>

  <!-- 3 Editorial Insight Cards -->
  <g transform="translate(80, 185)">
    <!-- Column 1: The Bottleneck -->
    <rect x="0" y="0" width="320" height="355" rx="14" fill="#FFFFFF" stroke="#FECACA" stroke-width="2"/>
    <rect x="0" y="0" width="320" height="42" rx="14" fill="#FEF2F2"/>
    <text x="20" y="27" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="800" fill="#B91C1C">01. THE CRITICAL BOTTLENECK</text>
    <text x="20" y="75" font-family="'Plus Jakarta Sans', sans-serif" font-size="18" font-weight="800" fill="#0F172A">${stages[0].title}</text>
    <text x="20" y="115" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" fill="#4B5563">${stages[0].bullets[0]}</text>
    <text x="20" y="150" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" fill="#4B5563">${stages[0].bullets[1]}</text>
    <text x="20" y="185" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" fill="#4B5563">${stages[0].bullets[2]}</text>
    <rect x="20" y="275" width="280" height="44" rx="8" fill="#F9FAFB" stroke="#E5E7EB"/>
    <text x="35" y="302" font-family="monospace" font-size="11" font-weight="bold" fill="#DC2626">RISK: Brittle runtime failure</text>

    <!-- Column 2: The Core Architecture -->
    <rect x="360" y="0" width="320" height="355" rx="14" fill="#FFFFFF" stroke="#BBF7D0" stroke-width="2"/>
    <rect x="360" y="0" width="320" height="42" rx="14" fill="#F0FDF4"/>
    <text x="380" y="27" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="800" fill="#15803D">02. SYSTEM INTERVENTION</text>
    <text x="380" y="75" font-family="'Plus Jakarta Sans', sans-serif" font-size="18" font-weight="800" fill="#0F172A">${stages[1].title}</text>
    <text x="380" y="115" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" fill="#4B5563">${stages[1].bullets[0]}</text>
    <text x="380" y="150" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" fill="#4B5563">${stages[1].bullets[1]}</text>
    <text x="380" y="185" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" fill="#4B5563">${stages[1].bullets[2]}</text>
    <rect x="380" y="275" width="280" height="44" rx="8" fill="#F0FDF4" stroke="#86EFAC"/>
    <text x="395" y="302" font-family="monospace" font-size="11" font-weight="bold" fill="#16A34A">FIX: Strict deterministic contract</text>

    <!-- Column 3: The Production Outcome -->
    <rect x="720" y="0" width="320" height="355" rx="14" fill="#FFFFFF" stroke="#BAE6FD" stroke-width="2"/>
    <rect x="720" y="0" width="320" height="42" rx="14" fill="#F0F9FF"/>
    <text x="740" y="27" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="800" fill="#0369A1">03. DURABLE ADVANTAGE</text>
    <text x="740" y="75" font-family="'Plus Jakarta Sans', sans-serif" font-size="18" font-weight="800" fill="#0F172A">${stages[3].title}</text>
    <text x="740" y="115" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" fill="#4B5563">${stages[3].bullets[0]}</text>
    <text x="740" y="150" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" fill="#4B5563">${stages[3].bullets[1]}</text>
    <text x="740" y="185" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" fill="#4B5563">${stages[3].bullets[2]}</text>
    <rect x="740" y="275" width="280" height="44" rx="8" fill="#F0F9FF" stroke="#7DD3FC"/>
    <text x="755" y="302" font-family="monospace" font-size="11" font-weight="bold" fill="#0284C7">SCALE: 100% verified throughput</text>
  </g>

  <!-- Footer -->
  <g transform="translate(80, 615)">
    <text x="0" y="0" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="800" fill="#0F172A">EXECUTIVE BRIEFING</text>
    <text x="140" y="0" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#6B7280">· Built for Engineering Leaders &amp; AI Architects</text>
  </g>
</svg>
    `.trim();
  }

  // ==========================================
  // STYLE 2: SPLIT COMPARISON / BEFORE VS AFTER
  // ==========================================
  if (style === 'comparison') {
    return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675">
  <rect width="1200" height="675" fill="#0D1117"/>

  <!-- Top Headline -->
  <g transform="translate(70, 50)">
    <rect x="0" y="0" width="190" height="32" rx="16" fill="#F59E0B" fill-opacity="0.15" stroke="#F59E0B" stroke-opacity="0.4"/>
    <circle cx="16" cy="16" r="4.5" fill="#F59E0B"/>
    <text x="28" y="21" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="800" fill="#F59E0B" letter-spacing="1.2">COMPARATIVE AUDIT</text>

    <text x="0" y="70" font-family="'Plus Jakarta Sans', sans-serif" font-size="34" font-weight="800" fill="#FFFFFF" letter-spacing="-0.5">${headline}</text>
    <text x="0" y="100" font-family="'Plus Jakarta Sans', sans-serif" font-size="15" font-weight="500" fill="#94A3B8">Comparing brittle legacy workflows with production-grade system architecture.</text>
  </g>

  <!-- Left: The Fragile Way -->
  <g transform="translate(70, 185)">
    <rect x="0" y="0" width="490" height="420" rx="18" fill="#181114" stroke="#DC2626" stroke-width="1.8"/>
    
    <!-- Header -->
    <rect x="0" y="0" width="490" height="55" rx="18" fill="#2E1218"/>
    <circle cx="28" cy="27" r="10" fill="#EF4444"/>
    <text x="24" y="32" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="bold" fill="#FFFFFF">✕</text>
    <text x="48" y="33" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="800" fill="#FCA5A5">THE BRITTLE / LEGACY WAY</text>

    <!-- Content Rows -->
    <g transform="translate(25, 85)">
      <text x="0" y="0" font-family="'Plus Jakarta Sans', sans-serif" font-size="15" font-weight="700" fill="#F87171">1. Slicing Repetitive Boilerplate</text>
      <text x="0" y="25" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" fill="#9CA3AF">Writing glue code by hand; high error rate; slow delivery.</text>

      <text x="0" y="85" font-family="'Plus Jakarta Sans', sans-serif" font-size="15" font-weight="700" fill="#F87171">2. Zero Formal Verification Bench</text>
      <text x="0" y="110" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" fill="#9CA3AF">Relying on manual spot checks; edge cases discovered by users.</text>

      <text x="0" y="170" font-family="'Plus Jakarta Sans', sans-serif" font-size="15" font-weight="700" fill="#F87171">3. Fragile Tool Interfaces</text>
      <text x="0" y="195" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" fill="#9CA3AF">Ad-hoc JSON payloads break on schema variations.</text>

      <rect x="0" y="260" width="440" height="45" rx="8" fill="#2E1218" stroke="#EF4444" stroke-opacity="0.4"/>
      <text x="16" y="288" font-family="monospace" font-size="12" font-weight="bold" fill="#F87171">OUTCOME: Technical debt &amp; slow velocity</text>
    </g>
  </g>

  <!-- Center VS Badge -->
  <g transform="translate(578, 370)">
    <circle cx="22" cy="22" r="24" fill="#0D1117" stroke="#334155" stroke-width="2"/>
    <text x="22" y="27" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="800" fill="#F59E0B" text-anchor="middle">VS</text>
  </g>

  <!-- Right: The Production System Way -->
  <g transform="translate(640, 185)">
    <rect x="0" y="0" width="490" height="420" rx="18" fill="#0C1D18" stroke="#10B981" stroke-width="1.8"/>

    <!-- Header -->
    <rect x="0" y="0" width="490" height="55" rx="18" fill="#0F382A"/>
    <circle cx="28" cy="27" r="10" fill="#10B981"/>
    <text x="24" y="32" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="bold" fill="#FFFFFF">✓</text>
    <text x="48" y="33" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="800" fill="#6EE7B7">THE PRODUCTION ARCHITECTURE</text>

    <!-- Content Rows -->
    <g transform="translate(25, 85)">
      <text x="0" y="0" font-family="'Plus Jakarta Sans', sans-serif" font-size="15" font-weight="700" fill="#34D399">1. Autonomous Code Generation</text>
      <text x="0" y="25" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" fill="#D1D5DB">Agents generate schemas, migrations, and scaffolding in seconds.</text>

      <text x="0" y="85" font-family="'Plus Jakarta Sans', sans-serif" font-size="15" font-weight="700" fill="#34D399">2. Continuous Regression Harness</text>
      <text x="0" y="110" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" fill="#D1D5DB">Deterministic evaluation benches catch regressions before merge.</text>

      <text x="0" y="170" font-family="'Plus Jakarta Sans', sans-serif" font-size="15" font-weight="700" fill="#34D399">3. Standardized MCP Protocols</text>
      <text x="0" y="195" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" fill="#D1D5DB">Type-safe tool calling with strict boundary sandboxing.</text>

      <rect x="0" y="260" width="440" height="45" rx="8" fill="#0F382A" stroke="#10B981" stroke-opacity="0.4"/>
      <text x="16" y="288" font-family="monospace" font-size="12" font-weight="bold" fill="#34D399">OUTCOME: 5x velocity &amp; rock-solid durability</text>
    </g>
  </g>
</svg>
    `.trim();
  }

  // ==========================================
  // STYLE 3: BIG TYPOGRAPHY / BOLD STATEMENT
  // ==========================================
  if (style === 'flux-cinematic') {
    return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675">
  <defs>
    <radialGradient id="meshGlow" cx="20%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#3B82F6" stop-opacity="0.25"/>
      <stop offset="50%" stop-color="#8B5CF6" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#090D16" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="1200" height="675" fill="#090D16"/>
  <rect width="1200" height="675" fill="url(#meshGlow)"/>

  <!-- Top Badge -->
  <g transform="translate(80, 60)">
    <rect x="0" y="0" width="170" height="32" rx="16" fill="#818CF8" fill-opacity="0.15" stroke="#818CF8" stroke-opacity="0.4"/>
    <circle cx="16" cy="16" r="4.5" fill="#818CF8"/>
    <text x="28" y="21" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="800" fill="#818CF8" letter-spacing="1.2">${badge}</text>
  </g>

  <!-- Big Bold Typography Hook -->
  <g transform="translate(80, 140)">
    <text x="0" y="60" font-family="'Plus Jakarta Sans', sans-serif" font-size="44" font-weight="900" fill="#FFFFFF" letter-spacing="-1">
      ${headline}
    </text>
    <text x="0" y="110" font-family="'Plus Jakarta Sans', sans-serif" font-size="20" font-weight="600" fill="#94A3B8">
      ${subtitle}
    </text>
  </g>

  <!-- 3 Big Metric / Architecture Cards -->
  <g transform="translate(80, 310)">
    <rect x="0" y="0" width="320" height="250" rx="20" fill="#131B2E" stroke="#223354" stroke-width="1.5"/>
    <text x="30" y="60" font-family="'Plus Jakarta Sans', sans-serif" font-size="42" font-weight="900" fill="#38BDF8">5x</text>
    <text x="30" y="95" font-family="'Plus Jakarta Sans', sans-serif" font-size="15" font-weight="700" fill="#FFFFFF">Delivery Velocity</text>
    <text x="30" y="130" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" fill="#94A3B8">Replaces days of manual boilerplate with instant verified code synthesis.</text>
    <text x="30" y="200" font-family="monospace" font-size="11" fill="#38BDF8">METRIC: CI/CD Throughput</text>

    <rect x="360" y="0" width="320" height="250" rx="20" fill="#131B2E" stroke="#223354" stroke-width="1.5"/>
    <text x="390" y="60" font-family="'Plus Jakarta Sans', sans-serif" font-size="42" font-weight="900" fill="#4ADE80">&lt;15ms</text>
    <text x="390" y="95" font-family="'Plus Jakarta Sans', sans-serif" font-size="15" font-weight="700" fill="#FFFFFF">Execution Overhead</text>
    <text x="390" y="130" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" fill="#94A3B8">Optimized runtime bounds eliminate latency spikes under peak enterprise load.</text>
    <text x="390" y="200" font-family="monospace" font-size="11" fill="#4ADE80">METRIC: p99 Latency</text>

    <rect x="720" y="0" width="320" height="250" rx="20" fill="#131B2E" stroke="#223354" stroke-width="1.5"/>
    <text x="750" y="60" font-family="'Plus Jakarta Sans', sans-serif" font-size="42" font-weight="900" fill="#F59E0B">100%</text>
    <text x="750" y="95" font-family="'Plus Jakarta Sans', sans-serif" font-size="15" font-weight="700" fill="#FFFFFF">Deterministic Verifiable</text>
    <text x="750" y="130" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" fill="#94A3B8">Continuous test harnesses eliminate unexpected production regressions.</text>
    <text x="750" y="200" font-family="monospace" font-size="11" fill="#F59E0B">METRIC: Harness Verification</text>
  </g>

  <!-- Subtle Footer -->
  <g transform="translate(80, 620)">
    <text x="0" y="0" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="700" fill="#64748B">POST STUDIO · PRODUCTION INSIGHT</text>
  </g>
</svg>
    `.trim();
  }

  // ==========================================
  // STYLE 4: CODE & TERMINAL CHEATSHEET
  // ==========================================
  if (style === 'cheatsheet') {
    return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675">
  <rect width="1200" height="675" fill="#0D1117"/>
  
  <!-- Subtle tech grid -->
  <g stroke="#FFFFFF" stroke-opacity="0.04" stroke-width="1.5">
    <line x1="0" y1="135" x2="1200" y2="135"/>
    <line x1="0" y1="270" x2="1200" y2="270"/>
    <line x1="0" y1="405" x2="1200" y2="405"/>
    <line x1="0" y1="540" x2="1200" y2="540"/>
  </g>

  <!-- Top Header Bar -->
  <g transform="translate(60, 45)">
    <rect x="0" y="0" width="180" height="32" rx="16" fill="${p.accent}" fill-opacity="0.15" stroke="${p.accent}" stroke-opacity="0.4"/>
    <circle cx="16" cy="16" r="4.5" fill="${p.accent}"/>
    <text x="28" y="21" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="800" fill="${p.accent}" letter-spacing="1.2">${badge}</text>

    <text x="0" y="70" font-family="'Plus Jakarta Sans', sans-serif" font-size="34" font-weight="800" fill="#FFFFFF" letter-spacing="-0.5">${headline}</text>
    <text x="0" y="98" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="500" fill="#94A3B8">${subtitle}</text>
  </g>

  <!-- 3 Cheatsheet Code Columns -->
  <g transform="translate(60, 185)">
    <!-- Card 1 -->
    <rect x="0" y="0" width="340" height="425" rx="14" fill="#161B22" stroke="#30363D" stroke-width="1.5"/>
    <rect x="0" y="0" width="340" height="40" rx="14" fill="#21262D"/>
    <circle cx="20" cy="20" r="5" fill="#FF5F56"/>
    <circle cx="36" cy="20" r="5" fill="#FFBD2E"/>
    <circle cx="52" cy="20" r="5" fill="#27C93F"/>
    <text x="70" y="24" font-family="monospace" font-size="12" font-weight="700" fill="#C9D1D9">01. Type-Safe Models</text>
    
    <text x="20" y="75" font-family="monospace" font-size="12" fill="#7EE787"># Modern Python 3.12+ syntax</text>
    <text x="20" y="105" font-family="monospace" font-size="12" fill="#FFA657">type Point[T] = tuple[T, T]</text>
    <text x="20" y="140" font-family="monospace" font-size="12" fill="#79C0FF">def process[T](val: T) -&gt; T:</text>
    <text x="20" y="170" font-family="monospace" font-size="12" fill="#8B949E">    return val</text>
    <text x="20" y="230" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#8B949E">✓ Eliminates verbose TypeVar classes</text>
    <text x="20" y="260" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#8B949E">✓ Mypy static analysis 2.4x faster</text>
    <text x="20" y="290" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#8B949E">✓ Zero runtime performance penalty</text>
    <rect x="20" y="355" width="300" height="40" rx="6" fill="#21262D"/>
    <text x="35" y="380" font-family="monospace" font-size="11" font-weight="bold" fill="#58A6FF">STATUS: PRODUCTION READY</text>

    <!-- Card 2 -->
    <rect x="370" y="0" width="340" height="425" rx="14" fill="#161B22" stroke="#30363D" stroke-width="1.5"/>
    <rect x="370" y="0" width="340" height="40" rx="14" fill="#21262D"/>
    <circle cx="390" cy="20" r="5" fill="#FF5F56"/>
    <circle cx="406" cy="20" r="5" fill="#FFBD2E"/>
    <circle cx="422" cy="20" r="5" fill="#27C93F"/>
    <text x="440" y="24" font-family="monospace" font-size="12" font-weight="700" fill="#C9D1D9">02. F-String Expressions</text>
    
    <text x="390" y="75" font-family="monospace" font-size="12" fill="#7EE787"># Quotes inside expressions</text>
    <text x="390" y="105" font-family="monospace" font-size="12" fill="#FFA657">msg = f"User: {data['name']}"</text>
    <text x="390" y="140" font-family="monospace" font-size="12" fill="#79C0FF">hex_str = f"{':'.join(f'{x:02x}')}"</text>
    <text x="390" y="230" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#8B949E">✓ Quotes &amp; backslashes unrestricted</text>
    <text x="390" y="260" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#8B949E">✓ Arbitrary nesting expressions</text>
    <text x="390" y="290" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#8B949E">✓ Clean, idiomatic string assembly</text>
    <rect x="390" y="355" width="300" height="40" rx="6" fill="#21262D"/>
    <text x="405" y="380" font-family="monospace" font-size="11" font-weight="bold" fill="#7EE787">STATUS: SYNTAX UPGRADE</text>

    <!-- Card 3 -->
    <rect x="740" y="0" width="340" height="425" rx="14" fill="#161B22" stroke="#30363D" stroke-width="1.5"/>
    <rect x="740" y="0" width="340" height="40" rx="14" fill="#21262D"/>
    <circle cx="760" cy="20" r="5" fill="#FF5F56"/>
    <circle cx="776" cy="20" r="5" fill="#FFBD2E"/>
    <circle cx="792" cy="20" r="5" fill="#27C93F"/>
    <text x="810" y="24" font-family="monospace" font-size="12" font-weight="700" fill="#C9D1D9">03. Subinterpreters (Per-GIL)</text>
    
    <text x="760" y="75" font-family="monospace" font-size="12" fill="#7EE787">import _xxsubinterpreters</text>
    <text x="760" y="105" font-family="monospace" font-size="12" fill="#FFA657">interp = interp_create()</text>
    <text x="760" y="140" font-family="monospace" font-size="12" fill="#79C0FF">interp_run(interp, task_code)</text>
    <text x="760" y="230" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#8B949E">✓ Real multi-core parallel scaling</text>
    <text x="760" y="260" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#8B949E">✓ Zero IPC serialization penalty</text>
    <text x="760" y="290" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#8B949E">✓ True thread isolation in memory</text>
    <rect x="760" y="355" width="300" height="40" rx="6" fill="#21262D"/>
    <text x="775" y="380" font-family="monospace" font-size="11" font-weight="bold" fill="#F2CC60">STATUS: TRUE PARALLELISM</text>
  </g>
</svg>
    `.trim();
  }

  // ==========================================
  // STYLE 5: INFOGRAPHIC / PIPELINE FLOW
  // ==========================================
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675">
  <rect width="1200" height="675" fill="${p.bg}"/>

  <defs>
    <radialGradient id="flowGlow" cx="50%" cy="25%" r="60%">
      <stop offset="0%" stop-color="${p.accent}" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="${p.bg}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="pipeTrack" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${p.accent}" stop-opacity="0.3"/>
      <stop offset="50%" stop-color="${p.accent}" stop-opacity="1"/>
      <stop offset="100%" stop-color="${p.accent2}" stop-opacity="0.3"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="675" fill="url(#flowGlow)"/>

  <!-- Top Title Block -->
  <g transform="translate(60, 45)">
    <rect x="0" y="0" width="200" height="32" rx="16" fill="${p.accent}" fill-opacity="0.15" stroke="${p.accent}" stroke-opacity="0.4"/>
    <circle cx="16" cy="16" r="4.5" fill="${p.accent}"/>
    <text x="28" y="21" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="800" fill="${p.accent}" letter-spacing="1.2">${badge}</text>

    <text x="0" y="72" font-family="'Plus Jakarta Sans', sans-serif" font-size="34" font-weight="800" fill="${p.text}" letter-spacing="-0.5">${headline}</text>
    <text x="0" y="102" font-family="'Plus Jakarta Sans', sans-serif" font-size="15" font-weight="500" fill="${p.subtext}">${subtitle}</text>
  </g>

  <!-- Flow Connector Track -->
  <path d="M 180 340 L 980 340" stroke="url(#pipeTrack)" stroke-width="3" stroke-dasharray="6 4"/>

  <!-- 4 Step Architecture Blocks -->
  <g transform="translate(60, 195)">
    <!-- Stage 1 -->
    <g transform="translate(10, 40)">
      <rect x="0" y="0" width="230" height="270" rx="16" fill="${p.card}" stroke="${p.border}" stroke-width="1.5"/>
      <rect x="18" y="-13" width="75" height="26" rx="8" fill="${p.accent}"/>
      <text x="55" y="4" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="800" fill="${p.bg}" text-anchor="middle">STAGE 01</text>
      
      <text x="20" y="42" font-family="'Plus Jakarta Sans', sans-serif" font-size="15" font-weight="800" fill="${p.text}">${stages[0].title}</text>
      <text x="20" y="75" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="${p.subtext}">${stages[0].bullets[0]}</text>
      <text x="20" y="102" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="${p.subtext}">${stages[0].bullets[1]}</text>
      <text x="20" y="129" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="${p.subtext}">${stages[0].bullets[2]}</text>

      <rect x="15" y="200" width="200" height="42" rx="8" fill="#FFFFFF" fill-opacity="0.05"/>
      <text x="25" y="226" font-family="monospace" font-size="10" fill="${p.accent}">${stages[0].formula}</text>
    </g>

    <!-- Stage 2 -->
    <g transform="translate(280, 40)">
      <rect x="0" y="0" width="230" height="270" rx="16" fill="${p.card}" stroke="${p.border}" stroke-width="1.5"/>
      <rect x="18" y="-13" width="75" height="26" rx="8" fill="${p.accent}"/>
      <text x="55" y="4" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="800" fill="${p.bg}" text-anchor="middle">STAGE 02</text>
      
      <text x="20" y="42" font-family="'Plus Jakarta Sans', sans-serif" font-size="15" font-weight="800" fill="${p.text}">${stages[1].title}</text>
      <text x="20" y="75" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="${p.subtext}">${stages[1].bullets[0]}</text>
      <text x="20" y="102" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="${p.subtext}">${stages[1].bullets[1]}</text>
      <text x="20" y="129" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="${p.subtext}">${stages[1].bullets[2]}</text>

      <rect x="15" y="200" width="200" height="42" rx="8" fill="#FFFFFF" fill-opacity="0.05"/>
      <text x="25" y="226" font-family="monospace" font-size="10" fill="${p.accent}">${stages[1].formula}</text>
    </g>

    <!-- Stage 3 -->
    <g transform="translate(550, 40)">
      <rect x="0" y="0" width="230" height="270" rx="16" fill="${p.card}" stroke="${p.border}" stroke-width="1.5"/>
      <rect x="18" y="-13" width="75" height="26" rx="8" fill="${p.accent}"/>
      <text x="55" y="4" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="800" fill="${p.bg}" text-anchor="middle">STAGE 03</text>
      
      <text x="20" y="42" font-family="'Plus Jakarta Sans', sans-serif" font-size="15" font-weight="800" fill="${p.text}">${stages[2].title}</text>
      <text x="20" y="75" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="${p.subtext}">${stages[2].bullets[0]}</text>
      <text x="20" y="102" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="${p.subtext}">${stages[2].bullets[1]}</text>
      <text x="20" y="129" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="${p.subtext}">${stages[2].bullets[2]}</text>

      <rect x="15" y="200" width="200" height="42" rx="8" fill="#FFFFFF" fill-opacity="0.05"/>
      <text x="25" y="226" font-family="monospace" font-size="10" fill="${p.accent}">${stages[2].formula}</text>
    </g>

    <!-- Stage 4 -->
    <g transform="translate(820, 40)">
      <rect x="0" y="0" width="230" height="270" rx="16" fill="${p.card}" stroke="${p.border}" stroke-width="1.5"/>
      <rect x="18" y="-13" width="75" height="26" rx="8" fill="${p.accent}"/>
      <text x="55" y="4" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="800" fill="${p.bg}" text-anchor="middle">STAGE 04</text>
      
      <text x="20" y="42" font-family="'Plus Jakarta Sans', sans-serif" font-size="15" font-weight="800" fill="${p.text}">${stages[3].title}</text>
      <text x="20" y="75" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="${p.subtext}">${stages[3].bullets[0]}</text>
      <text x="20" y="102" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="${p.subtext}">${stages[3].bullets[1]}</text>
      <text x="20" y="129" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="${p.subtext}">${stages[3].bullets[2]}</text>

      <rect x="15" y="200" width="200" height="42" rx="8" fill="#FFFFFF" fill-opacity="0.05"/>
      <text x="25" y="226" font-family="monospace" font-size="10" fill="${p.accent}">${stages[3].formula}</text>
    </g>
  </g>

  <!-- Footer Branding -->
  <g transform="translate(60, 615)">
    <text x="0" y="0" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="800" fill="${p.accent}">POSTMARK ARCHITECTURE</text>
    <text x="175" y="0" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="${p.subtext}">· Continuous System Flow &amp; Governance</text>
  </g>
</svg>
  `.trim();
}

/**
 * Builds the VisualArtwork object based on the user's thought and chosen style.
 */
export function generateCrazyVisual(thought: string, role: string, options?: Partial<RenderOptions>): VisualArtwork {
  const chosenStyle: VisualStyle = options?.style || detectRecommendedStyle(thought);

  // Calibrate best default palette per visual style if not overridden
  const defaultPalette = options?.paletteTheme || (
    chosenStyle === 'editorial-3d' ? 'light' :
    chosenStyle === 'comparison' ? 'dark' :
    chosenStyle === 'flux-cinematic' ? 'indigo' :
    chosenStyle === 'cheatsheet' ? 'dark' : 'sage'
  );

  // Always generate an ultra-crisp, high-definition SVG vector graphic
  const svg = renderVectorCard({
    thought,
    role,
    style: chosenStyle,
    customHeadline: options?.customHeadline,
    customSubtitle: options?.customSubtitle,
    customBadge: options?.customBadge,
    paletteTheme: defaultPalette
  });

  const cleanSvg = svg.trim();
  let dataUrl = '';
  try {
    dataUrl = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(cleanSvg)))}`;
  } catch {
    dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(cleanSvg)}`;
  }

  const badgeText = options?.customBadge || (
    chosenStyle === 'cheatsheet' ? 'CHEATSHEET' :
    chosenStyle === 'comparison' ? 'PARADIGM SHIFT' :
    chosenStyle === 'editorial-3d' ? 'EXECUTIVE BRIEF' :
    chosenStyle === 'flux-cinematic' ? 'INDUSTRY IMPACT' : 'SYSTEM ARCHITECTURE'
  );

  return {
    dataUrl,
    prompt: `Architectural Blueprint: ${thought}`,
    headline: options?.customHeadline || (thought.length > 38 ? thought.substring(0, 38) + '...' : thought),
    subtitle: options?.customSubtitle || 'Technical Blueprint & Architecture Breakdown',
    badge: badgeText,
    style: chosenStyle,
    palette: defaultPalette === 'light' ? ['#FAF9F5', '#0F172A', '#10B981'] : ['#090D16', '#38BDF8', '#818CF8']
  };
}

/**
 * Generates an editable Abstract Syntax Tree (CanvasElement array)
 * so that the user can manipulate every card, arrow, badge, and code block
 * directly in VisualWorkbench.
 */
export function generateVisualAst(
  thought: string,
  role: string,
  style?: VisualStyle,
  brandKit?: import('../types/studio').BrandKit
): import('../types/canvas').CanvasElement[] {
  const chosenStyle = style || detectRecommendedStyle(thought);
  const t = thought.toLowerCase();
  const creatorHandle = brandKit?.handle || '@alexvance.ai';
  const creatorName = brandKit?.creatorName || 'Alex Vance';

  // Template 1: Python / Code Cheatsheet
  if (chosenStyle === 'cheatsheet' || t.includes('python') || t.includes('code') || t.includes('syntax')) {
    return [
      // Top badge
      {
        id: 'ast-badge',
        type: 'shape',
        shapeType: 'pill',
        x: 60,
        y: 40,
        width: 220,
        height: 34,
        zIndex: 1,
        fillColor: '#3E6F58',
        textColor: '#FFFFFF',
        accentText: '🐍 PYTHON 3.12+ CHEATSHEET',
        borderRadius: 17
      },
      // Title
      {
        id: 'ast-title',
        type: 'text',
        x: 60,
        y: 90,
        width: 900,
        height: 50,
        zIndex: 2,
        text: '3 Modern Python Idioms for High-Scale Services',
        fontSize: 34,
        fontFamily: 'sans',
        fontWeight: 'extrabold',
        textColor: '#1F322C'
      },
      // Subtitle
      {
        id: 'ast-subtitle',
        type: 'text',
        x: 60,
        y: 145,
        width: 800,
        height: 30,
        zIndex: 2,
        text: 'Idiomatic, memory-optimized, and zero premature abstractions.',
        fontSize: 16,
        fontFamily: 'sans',
        fontWeight: 'normal',
        textColor: '#5A6F64'
      },
      // Code Card 1
      {
        id: 'ast-code-1',
        type: 'code',
        x: 60,
        y: 195,
        width: 330,
        height: 250,
        zIndex: 3,
        accentText: '01. PEP 695 TYPE ALIASES',
        codeLanguage: 'python',
        codeText: `# Clean generic syntax\ntype Registry[T] = dict[str, T]\n\ndef fetch[T](k: str) -> T:\n    return db.get(k)\n# No clumsy TypeVar imports!`,
        fillColor: '#0F172A',
        textColor: '#F8FAFC',
        borderRadius: 16
      },
      // Code Card 2
      {
        id: 'ast-code-2',
        type: 'code',
        x: 425,
        y: 195,
        width: 330,
        height: 250,
        zIndex: 3,
        accentText: '02. @DATACLASS(SLOTS=TRUE)',
        codeLanguage: 'python',
        codeText: `@dataclass(slots=True)\nclass TelemetryPacket:\n    timestamp: float\n    node_id: str\n    p99_latency: float\n# 2x memory reduction!`,
        fillColor: '#0F172A',
        textColor: '#F8FAFC',
        borderRadius: 16
      },
      // Code Card 3
      {
        id: 'ast-code-3',
        type: 'code',
        x: 790,
        y: 195,
        width: 330,
        height: 250,
        zIndex: 3,
        accentText: '03. WALRUS & DICT UNPACK',
        codeLanguage: 'python',
        codeText: `if (match := pattern.search(msg)):\n    payload = match.group(1)\n\nmerged = {**config, **overrides}\n# Concise and expressive`,
        fillColor: '#0F172A',
        textColor: '#F8FAFC',
        borderRadius: 16
      },
      // Bottom Takeaway Banner
      {
        id: 'ast-takeaway',
        type: 'shape',
        shapeType: 'takeaway-bar',
        x: 60,
        y: 475,
        width: 1060,
        height: 60,
        zIndex: 4,
        fillColor: '#1F322C',
        textColor: '#FFFFFF',
        accentText: '💡 GOLDEN RULE: Write code for the engineer debugging your service at 2:00 AM.',
        borderRadius: 12
      },
      // Creator Watermark
      {
        id: 'ast-watermark',
        type: 'text',
        x: 60,
        y: 560,
        width: 500,
        height: 30,
        zIndex: 5,
        text: `${creatorName} · ${creatorHandle} | Modern Backend Engineering`,
        fontSize: 13,
        fontFamily: 'mono',
        fontWeight: 'bold',
        textColor: '#3E6F58'
      }
    ];
  }

  // Template 2: RAG & System Architecture
  if (t.includes('rag') || t.includes('architecture') || t.includes('pipeline') || t.includes('retrieval') || t.includes('system design')) {
    return [
      {
        id: 'ast-badge',
        type: 'shape',
        shapeType: 'pill',
        x: 60,
        y: 35,
        width: 240,
        height: 32,
        zIndex: 1,
        fillColor: '#1F322C',
        textColor: '#FFFFFF',
        accentText: '⚡ PRODUCTION ARCHITECTURE',
        borderRadius: 16
      },
      {
        id: 'ast-title',
        type: 'text',
        x: 60,
        y: 80,
        width: 950,
        height: 48,
        zIndex: 2,
        text: 'How Production RAG Systems Actually Work',
        fontSize: 34,
        fontFamily: 'sans',
        fontWeight: 'extrabold',
        textColor: '#1F322C'
      },
      {
        id: 'ast-subtitle',
        type: 'text',
        x: 60,
        y: 135,
        width: 900,
        height: 25,
        zIndex: 2,
        text: 'Moving past naive cosine similarity: 4-stage hybrid retrieval & rerank pipeline.',
        fontSize: 15,
        fontFamily: 'sans',
        fontWeight: 'normal',
        textColor: '#5A6F64'
      },
      // Step 1
      {
        id: 'ast-card-1',
        type: 'shape',
        shapeType: 'card',
        x: 60,
        y: 180,
        width: 245,
        height: 250,
        zIndex: 3,
        fillColor: '#FFFFFF',
        borderColor: '#3E6F58',
        borderWidth: 2,
        borderRadius: 16,
        accentText: 'STEP 01: CHUNKING & EMBED',
        text: '• Semantic markdown splitting\n• 512 token chunk overlap\n• Domain-specific vector models\n• Metadata tagging (user, ACL)'
      },
      // Arrow 1 -> 2
      {
        id: 'ast-arrow-1',
        type: 'shape',
        shapeType: 'arrow',
        x: 310,
        y: 295,
        width: 28,
        height: 18,
        zIndex: 4,
        fillColor: '#3E6F58'
      },
      // Step 2
      {
        id: 'ast-card-2',
        type: 'shape',
        shapeType: 'card',
        x: 345,
        y: 180,
        width: 245,
        height: 250,
        zIndex: 3,
        fillColor: '#FFFFFF',
        borderColor: '#3E6F58',
        borderWidth: 2,
        borderRadius: 16,
        accentText: 'STEP 02: HYBRID INDEX',
        text: '• Dense: HNSW vector search\n• Sparse: BM25 exact keyword\n• Reciprocal Rank Fusion (RRF)\n• pgvector / Qdrant storage'
      },
      // Arrow 2 -> 3
      {
        id: 'ast-arrow-2',
        type: 'shape',
        shapeType: 'arrow',
        x: 595,
        y: 295,
        width: 28,
        height: 18,
        zIndex: 4,
        fillColor: '#3E6F58'
      },
      // Step 3
      {
        id: 'ast-card-3',
        type: 'shape',
        shapeType: 'card',
        x: 630,
        y: 180,
        width: 245,
        height: 250,
        zIndex: 3,
        fillColor: '#FFFFFF',
        borderColor: '#3E6F58',
        borderWidth: 2,
        borderRadius: 16,
        accentText: 'STEP 03: CROSS-RERANK',
        text: '• Fetch top 30 candidate chunks\n• Cross-encoder attention scoring\n• Eliminates irrelevant noise\n• Keep top 5 precise chunks'
      },
      // Arrow 3 -> 4
      {
        id: 'ast-arrow-3',
        type: 'shape',
        shapeType: 'arrow',
        x: 880,
        y: 295,
        width: 28,
        height: 18,
        zIndex: 4,
        fillColor: '#3E6F58'
      },
      // Step 4
      {
        id: 'ast-card-4',
        type: 'shape',
        shapeType: 'card',
        x: 915,
        y: 180,
        width: 245,
        height: 250,
        zIndex: 3,
        fillColor: '#FFFFFF',
        borderColor: '#3E6F58',
        borderWidth: 2,
        borderRadius: 16,
        accentText: 'STEP 04: GROUNDED SYNTHESIS',
        text: '• Strict context injection\n• Hallucination guardrails\n• Source citation markers\n• Latency < 1.2s P95'
      },
      // Bottom Takeaway Banner
      {
        id: 'ast-takeaway',
        type: 'shape',
        shapeType: 'takeaway-bar',
        x: 60,
        y: 460,
        width: 1100,
        height: 60,
        zIndex: 5,
        fillColor: '#1F322C',
        textColor: '#FFFFFF',
        accentText: '💡 KEY TAKEAWAY: The LLM is 10% of the system. The retrieval & reranking pipeline is the actual moat.',
        borderRadius: 12
      },
      // Creator Watermark
      {
        id: 'ast-watermark',
        type: 'text',
        x: 60,
        y: 545,
        width: 600,
        height: 30,
        zIndex: 5,
        text: `${creatorName} · ${creatorHandle} | AI Systems Architecture`,
        fontSize: 13,
        fontFamily: 'mono',
        fontWeight: 'bold',
        textColor: '#3E6F58'
      }
    ];
  }

  // Template 3: 8-Stage Roadmap (Dandes Academy style)
  return [
    {
      id: 'ast-badge',
      type: 'shape',
      shapeType: 'pill',
      x: 60,
      y: 30,
      width: 220,
      height: 30,
      zIndex: 1,
      fillColor: '#1F322C',
      textColor: '#FFFFFF',
      accentText: '🚀 8-STAGE ROADMAP',
      borderRadius: 15
    },
    {
      id: 'ast-title',
      type: 'text',
      x: 60,
      y: 70,
      width: 900,
      height: 44,
      zIndex: 2,
      text: thought.length > 40 ? thought.substring(0, 40) + '...' : (thought || 'Enterprise Implementation Roadmap'),
      fontSize: 30,
      fontFamily: 'sans',
      fontWeight: 'extrabold',
      textColor: '#1F322C'
    },
    // Row 1 (4 cards)
    {
      id: 'ast-step-1',
      type: 'shape',
      shapeType: 'card',
      x: 60,
      y: 135,
      width: 250,
      height: 140,
      zIndex: 3,
      fillColor: '#FFFFFF',
      borderRadius: 12,
      accentText: 'PHASE 01: SCOPE & GOALS',
      text: 'Define non-negotiable success metrics and hard latency budgets.'
    },
    {
      id: 'ast-step-2',
      type: 'shape',
      shapeType: 'card',
      x: 340,
      y: 135,
      width: 250,
      height: 140,
      zIndex: 3,
      fillColor: '#FFFFFF',
      borderRadius: 12,
      accentText: 'PHASE 02: DATA QUALITY',
      text: 'Curate ground-truth evaluation datasets and edge-case samples.'
    },
    {
      id: 'ast-step-3',
      type: 'shape',
      shapeType: 'card',
      x: 620,
      y: 135,
      width: 250,
      height: 140,
      zIndex: 3,
      fillColor: '#FFFFFF',
      borderRadius: 12,
      accentText: 'PHASE 03: EXECUTION GRAPH',
      text: 'Trace multi-step tool calls, schema validation, and state machines.'
    },
    {
      id: 'ast-step-4',
      type: 'shape',
      shapeType: 'card',
      x: 900,
      y: 135,
      width: 250,
      height: 140,
      zIndex: 3,
      fillColor: '#FFFFFF',
      borderRadius: 12,
      accentText: 'PHASE 04: QUALITY SCORING',
      text: 'Measure precision, hallucination rate, and token unit economics.'
    },
    // Row 2 (4 cards)
    {
      id: 'ast-step-5',
      type: 'shape',
      shapeType: 'card',
      x: 60,
      y: 300,
      width: 250,
      height: 140,
      zIndex: 3,
      fillColor: '#FFFFFF',
      borderRadius: 12,
      accentText: 'PHASE 05: ROOT CAUSE TRIAGE',
      text: 'Systematically diagnose failures: tool schema drift or context loss.'
    },
    {
      id: 'ast-step-6',
      type: 'shape',
      shapeType: 'card',
      x: 340,
      y: 300,
      width: 250,
      height: 140,
      zIndex: 3,
      fillColor: '#FFFFFF',
      borderRadius: 12,
      accentText: 'PHASE 06: GUARDRAILS',
      text: 'Harden input filters, deterministic assertions, and policy rules.'
    },
    {
      id: 'ast-step-7',
      type: 'shape',
      shapeType: 'card',
      x: 620,
      y: 300,
      width: 250,
      height: 140,
      zIndex: 3,
      fillColor: '#FFFFFF',
      borderRadius: 12,
      accentText: 'PHASE 07: VARIANCE AUDIT',
      text: 'Run the identical test suite 5x to ensure repeatability > 98%.'
    },
    {
      id: 'ast-step-8',
      type: 'shape',
      shapeType: 'card',
      x: 900,
      y: 300,
      width: 250,
      height: 140,
      zIndex: 3,
      fillColor: '#FFFFFF',
      borderRadius: 12,
      accentText: 'PHASE 08: PRODUCTION DRIFT',
      text: 'Continuously sample live interactions and log anomaly alerts.'
    },
    // Bottom Takeaway
    {
      id: 'ast-takeaway',
      type: 'shape',
      shapeType: 'takeaway-bar',
      x: 60,
      y: 470,
      width: 1090,
      height: 55,
      zIndex: 4,
      fillColor: '#1F322C',
      textColor: '#FFFFFF',
      accentText: '💡 SUMMARY: Software is tested once. Intelligence systems are evaluated continuously.',
      borderRadius: 10
    },
    // Watermark
    {
      id: 'ast-watermark',
      type: 'text',
      x: 60,
      y: 550,
      width: 500,
      height: 25,
      zIndex: 5,
      text: `${creatorName} · ${creatorHandle} | Engineering Strategy`,
      fontSize: 13,
      fontFamily: 'mono',
      fontWeight: 'bold',
      textColor: '#3E6F58'
    }
  ];
}

