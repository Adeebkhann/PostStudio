import { TagItem, TagVelocity } from '../types/studio';

/**
 * Extracts semantic keywords and technical terms directly from user's input.
 * No hardcoded static trend database.
 */
function extractDynamicKeywords(text: string): string[] {
  const clean = text.replace(/[^a-zA-Z0-9\s_-]/g, ' ');
  const tokens = clean.split(/\s+/).filter(w => w.length >= 2);

  const stopwords = new Set([
    'the', 'and', 'for', 'that', 'this', 'with', 'from', 'have', 'about',
    'what', 'when', 'your', 'will', 'just', 'more', 'some', 'them', 'they',
    'here', 'there', 'make', 'into', 'than', 'then', 'very', 'how', 'why',
    'which', 'each', 'does', 'been', 'were', 'also', 'over', 'under', 'such'
  ]);

  const unique = new Set<string>();

  for (const token of tokens) {
    const lower = token.toLowerCase();
    if (!stopwords.has(lower) && lower.length > 2) {
      // Capitalize first letter or preserve uppercase acronyms (like RAG, AI, LLM, API, SQL)
      let formatted: string;
      if (token.length <= 4 && token === token.toUpperCase()) {
        formatted = token;
      } else {
        formatted = token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
      }
      unique.add(formatted);
    }
  }

  return Array.from(unique);
}

/**
 * Generates dynamic hashtags derived 100% from user's thought, profession, and role.
 */
export function generateTrendingTags(
  thought: string,
  profession: string,
  role: string
): TagItem[] {
  const thoughtKeywords = extractDynamicKeywords(thought);
  const roleKeywords = extractDynamicKeywords(`${profession} ${role}`);

  // Combine and prioritize thought terms first, then role terms
  const allTerms = Array.from(new Set([...thoughtKeywords, ...roleKeywords]));

  // If input was very short, add clean contextual tags
  if (allTerms.length === 0) {
    allTerms.push('TechLeadership', 'SoftwareEngineering', 'SystemDesign');
  }

  const tags: TagItem[] = allTerms.slice(0, 8).map((term, index) => {
    let velocity: TagVelocity = 'core';
    if (index === 0 || index === 1) {
      velocity = 'trending';
    } else if (index === 2 || index === 3) {
      velocity = 'rising';
    }

    return {
      id: `tag-${term.toLowerCase()}-${index}`,
      name: term,
      velocity,
      selected: index < 4 // Select top 4 by default
    };
  });

  return tags;
}
