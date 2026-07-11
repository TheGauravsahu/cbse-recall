// Dynamic eager loading of all markdown files at startup
const noteFiles = import.meta.glob('/src/notes/**/*.md', { query: '?raw', import: 'default', eager: true });

// Basic Frontmatter Parser
export function parseFrontmatter(mdText) {
  const match = mdText.match(/^---([\s\S]*?)---/);
  if (!match) return { metadata: {}, content: mdText };

  const yamlStr = match[1];
  const content = mdText.substring(match[0].length).trim();
  const metadata = {};

  yamlStr.split('\n').forEach((line) => {
    const parts = line.split(':');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join(':').trim();
      
      // Parse tags
      if (key === 'tags') {
        metadata[key] = [];
      } else if (line.trim().startsWith('-') && metadata['tags']) {
        const tag = line.replace(/^\s*-\s*/, '').trim();
        metadata['tags'].push(tag);
      } else {
        // Strip quotes if any
        metadata[key] = val.replace(/^["']|["']$/g, '');
      }
    } else if (line.trim().startsWith('-') && metadata['tags']) {
      const tag = line.replace(/^\s*-\s*/, '').trim();
      metadata['tags'].push(tag);
    }
  });

  return { metadata, content };
}

// Global search index array
const searchIndex = [];

// Compile the index once at load time
export function compileSearchIndex() {
  if (searchIndex.length > 0) return;

  Object.entries(noteFiles).forEach(([path, fileContent]) => {
    // Extract subjectId and chapterId from path
    // Path looks like: /src/notes/maths/trigonometry.md
    const pathParts = path.split('/');
    const subjectId = pathParts[pathParts.length - 2];
    const chapterId = pathParts[pathParts.length - 1].replace('.md', '');

    const { metadata, content } = parseFrontmatter(fileContent);

    // Index the entire chapter title
    searchIndex.push({
      subjectId,
      chapterId,
      type: 'title',
      heading: '',
      text: metadata.title || '',
      tags: metadata.tags || [],
      metadata
    });

    // Parse sections
    const lines = content.split('\n');
    let currentHeading = 'Introduction';

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('#')) {
        // Heading item
        const hText = trimmed.replace(/^#+\s+/, '');
        currentHeading = hText;
        searchIndex.push({
          subjectId,
          chapterId,
          type: 'heading',
          heading: currentHeading,
          text: hText,
          tags: metadata.tags || [],
          metadata
        });
      } else if (trimmed !== '' && !trimmed.startsWith('---') && !trimmed.startsWith('|') && !trimmed.startsWith('>')) {
        // Paragraph item
        searchIndex.push({
          subjectId,
          chapterId,
          type: 'body',
          heading: currentHeading,
          text: trimmed,
          tags: metadata.tags || [],
          metadata
        });
      }
    });
  });
}

// Run compilation
compileSearchIndex();

// Search execution with simple scoring & snippet generator
export function searchNotes(query) {
  if (!query || !query.trim()) return [];
  compileSearchIndex();

  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const results = [];

  // Group by chapter to collect matches
  const chapterMatches = {};

  searchIndex.forEach((item) => {
    let score = 0;
    const textLower = item.text.toLowerCase();

    // Check matches
    terms.forEach((term) => {
      if (textLower.includes(term)) {
        if (item.type === 'title') score += 15;
        else if (item.type === 'heading') score += 8;
        else score += 2;
      }
      
      // Match tags
      if (item.tags.some(t => t.toLowerCase().includes(term))) {
        score += 5;
      }
    });

    if (score > 0) {
      const key = `${item.subjectId}/${item.chapterId}`;
      if (!chapterMatches[key]) {
        chapterMatches[key] = {
          subjectId: item.subjectId,
          chapterId: item.chapterId,
          title: item.metadata.title || item.chapterId,
          score: 0,
          bestSnippet: '',
          matchedHeadings: new Set()
        };
      }

      chapterMatches[key].score += score;
      
      if (item.heading) {
        chapterMatches[key].matchedHeadings.add(item.heading);
      }

      // Keep the paragraph as a snippet if we don't have one yet, or if it is a body match
      if (item.type === 'body' && (!chapterMatches[key].bestSnippet || item.text.length < chapterMatches[key].bestSnippet.length)) {
        // Highlight matching term in snippet
        let snippet = item.text;
        if (snippet.length > 120) {
          const matchIdx = snippet.toLowerCase().indexOf(terms[0]);
          const start = Math.max(0, matchIdx - 40);
          const end = Math.min(snippet.length, matchIdx + 80);
          snippet = (start > 0 ? '...' : '') + snippet.substring(start, end) + (end < snippet.length ? '...' : '');
        }
        chapterMatches[key].bestSnippet = snippet;
      }
    }
  });

  return Object.values(chapterMatches)
    .sort((a, b) => b.score - a.score)
    .map(match => ({
      ...match,
      matchedHeadings: Array.from(match.matchedHeadings).slice(0, 2)
    }));
}

// Load static note raw file helper
export function getNoteRawContent(subjectId, chapterId) {
  const path = `/src/notes/${subjectId}/${chapterId}.md`;
  return noteFiles[path] || null;
}
