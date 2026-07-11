import React from 'react';
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
  Font 
} from '@react-pdf/renderer';

// Register standard built-in fonts (Helvetica, Courier are built-in)
// Using built-in Helvetica ensures completely offline reliability.

// Lightweight custom markdown-to-blocks parser
export function parseMarkdownToBlocks(mdText) {
  const content = mdText.replace(/^---[\s\S]*?---/, '').trim();
  const lines = content.split('\n');
  const blocks = [];
  let currentBlock = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code Block
    if (line.trim().startsWith('```')) {
      if (currentBlock && currentBlock.type === 'code') {
        blocks.push(currentBlock);
        currentBlock = null;
      } else {
        if (currentBlock) blocks.push(currentBlock);
        const match = line.match(/```(\w*)/);
        currentBlock = { type: 'code', lang: match ? match[1] : '', codeLines: [] };
      }
      continue;
    }

    if (currentBlock && currentBlock.type === 'code') {
      currentBlock.codeLines.push(line);
      continue;
    }

    // Callout (Blockquotes)
    if (line.startsWith('>')) {
      const text = line.substring(1).trim();
      if (currentBlock && currentBlock.type === 'callout') {
        currentBlock.lines.push(text);
      } else {
        if (currentBlock) blocks.push(currentBlock);
        currentBlock = { type: 'callout', lines: [text] };
      }
      continue;
    }

    // List Items
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ') || /^\d+\.\s/.test(line.trim())) {
      const isOrdered = /^\d+\.\s/.test(line.trim());
      const cleanLine = line.trim().replace(/^[-*\d.]+\s+/, '');
      if (currentBlock && currentBlock.type === 'list') {
        currentBlock.items.push(cleanLine);
      } else {
        if (currentBlock) blocks.push(currentBlock);
        currentBlock = { type: 'list', ordered: isOrdered, items: [cleanLine] };
      }
      continue;
    }

    // Table
    if (line.startsWith('|')) {
      const cells = line.split('|').map(c => c.trim()).filter((c, idx, arr) => idx > 0 && idx < arr.length - 1);
      const isAlignLine = cells.every(c => c.startsWith(':') || c.startsWith('-') || c.endsWith(':'));
      if (isAlignLine) continue;

      if (currentBlock && currentBlock.type === 'table') {
        currentBlock.rows.push(cells);
      } else {
        if (currentBlock) blocks.push(currentBlock);
        currentBlock = { type: 'table', headers: cells, rows: [] };
      }
      continue;
    }

    // Heading
    if (line.startsWith('#')) {
      if (currentBlock) blocks.push(currentBlock);
      const match = line.match(/^(#+)\s+(.*)$/);
      if (match) {
        blocks.push({
          type: 'heading',
          level: match[1].length,
          text: match[2].trim()
        });
      }
      currentBlock = null;
      continue;
    }

    // Divider
    if (line.trim() === '---') {
      if (currentBlock) blocks.push(currentBlock);
      blocks.push({ type: 'divider' });
      currentBlock = null;
      continue;
    }

    // Empty Lines
    if (line.trim() === '') {
      if (currentBlock) {
        blocks.push(currentBlock);
        currentBlock = null;
      }
      continue;
    }

    // Paragraph
    if (currentBlock && currentBlock.type === 'paragraph') {
      currentBlock.text += ' ' + line.trim();
    } else {
      if (currentBlock) blocks.push(currentBlock);
      currentBlock = { type: 'paragraph', text: line.trim() };
    }
  }

  if (currentBlock) blocks.push(currentBlock);
  return blocks;
}

// Clean LaTeX tag stripper for PDF text representation
function cleanMathExpressions(text) {
  if (!text) return '';
  return text
    .replace(/\$\$(.*?)\$\$/g, '$1') // block math
    .replace(/\$(.*?)\$/g, '$1')   // inline math
    .replace(/\\theta/g, 'θ')
    .replace(/\\sin/g, 'sin')
    .replace(/\\cos/g, 'cos')
    .replace(/\\tan/g, 'tan')
    .replace(/\\sec/g, 'sec')
    .replace(/\\cot/g, 'cot')
    .replace(/\\cosec/g, 'cosec')
    .replace(/\\frac\{(.*?)\}\{(.*?)\}/g, '$1/$2')
    .replace(/\\sqrt\{(.*?)\}/g, '√$1')
    .replace(/\\degree/g, '°')
    .replace(/\\le/g, '≤')
    .replace(/\\ge/g, '≥')
    .replace(/\\propto/g, '∝')
    .replace(/\\implies/g, '⟹');
}

// Stylesheet Generator based on Orientation & Theme
const createStyles = (options) => {
  const isDark = options.theme === 'dark';
  const paperSize = options.paperSize || 'A4';
  const isLandscape = options.orientation === 'landscape';

  const palette = {
    bg: isDark ? '#020617' : '#FFFFFF',
    text: isDark ? '#F1F5F9' : '#1E293B',
    textSecondary: isDark ? '#94A3B8' : '#64748B',
    border: isDark ? '#334155' : '#E2E8F0',
    primary: '#2563EB',
    cardBg: isDark ? '#0F172A' : '#F8FAFC',
    codeBg: '#090D16',
    calloutBg: isDark ? '#1E293B' : '#F0F4FF',
    calloutBorder: '#2563EB'
  };

  return StyleSheet.create({
    page: {
      paddingTop: 50,
      paddingBottom: 60,
      paddingHorizontal: 45,
      backgroundColor: palette.bg,
      color: palette.text,
      fontFamily: 'Helvetica'
    },
    
    // Header & Footer
    header: {
      position: 'absolute',
      top: 25,
      left: 45,
      right: 45,
      borderBottomWidth: 0.5,
      borderBottomColor: palette.border,
      paddingBottom: 5,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      fontSize: 8,
      color: palette.textSecondary,
      fontFamily: 'Helvetica-Bold'
    },
    footer: {
      position: 'absolute',
      bottom: 25,
      left: 45,
      right: 45,
      borderTopWidth: 0.5,
      borderTopColor: palette.border,
      paddingTop: 8,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      fontSize: 8,
      color: palette.textSecondary
    },
    pageNumber: {
      fontFamily: 'Helvetica-Bold'
    },

    // Cover Page Styles
    coverPage: {
      backgroundColor: palette.bg,
      padding: 60,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      height: '100%',
      color: palette.text
    },
    coverHeader: {
      fontSize: 12,
      fontFamily: 'Helvetica-Bold',
      color: palette.primary,
      textTransform: 'uppercase',
      letterSpacing: 2,
      marginBottom: 10
    },
    coverTitle: {
      fontSize: 32,
      fontFamily: 'Helvetica-Bold',
      marginBottom: 15,
      lineHeight: 1.2
    },
    coverSubtitle: {
      fontSize: 14,
      color: palette.textSecondary,
      marginBottom: 50
    },
    coverBadge: {
      backgroundColor: palette.primary,
      borderRadius: 4,
      paddingVertical: 4,
      paddingHorizontal: 8,
      alignSelf: 'flex-start',
      marginBottom: 120
    },
    coverBadgeText: {
      color: '#FFFFFF',
      fontSize: 9,
      fontFamily: 'Helvetica-Bold',
      textTransform: 'uppercase'
    },
    coverFooter: {
      borderTopWidth: 1,
      borderTopColor: palette.border,
      paddingTop: 20,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    coverFooterLeft: {
      fontSize: 10,
      fontFamily: 'Helvetica-Bold',
      color: palette.text
    },
    coverFooterRight: {
      fontSize: 9,
      color: palette.textSecondary
    },

    // Markdown Elements
    h1: {
      fontSize: 18,
      fontFamily: 'Helvetica-Bold',
      marginTop: 22,
      marginBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: palette.border,
      paddingBottom: 4
    },
    h2: {
      fontSize: 14,
      fontFamily: 'Helvetica-Bold',
      marginTop: 18,
      marginBottom: 8,
      color: palette.primary
    },
    h3: {
      fontSize: 11,
      fontFamily: 'Helvetica-Bold',
      marginTop: 14,
      marginBottom: 6
    },
    p: {
      fontSize: 10,
      lineHeight: 1.6,
      marginBottom: 10,
      textAlign: 'justify'
    },
    divider: {
      borderBottomWidth: 1,
      borderBottomColor: palette.border,
      marginVertical: 15
    },

    // Callout Box
    calloutContainer: {
      borderLeftWidth: 3,
      borderLeftColor: palette.calloutBorder,
      backgroundColor: palette.calloutBg,
      padding: 12,
      marginVertical: 12,
      borderRadius: 4
    },
    calloutTitle: {
      fontSize: 8,
      fontFamily: 'Helvetica-Bold',
      color: palette.primary,
      textTransform: 'uppercase',
      marginBottom: 4,
      letterSpacing: 1
    },
    calloutText: {
      fontSize: 9.5,
      lineHeight: 1.5,
      color: palette.text
    },

    // Monospace Code Block
    codeBlock: {
      backgroundColor: palette.codeBg,
      padding: 10,
      marginVertical: 12,
      borderRadius: 6,
      borderWidth: 0.5,
      borderColor: palette.border
    },
    codeText: {
      fontFamily: 'Courier',
      fontSize: 8.5,
      lineHeight: 1.4,
      color: '#A7F3D0'
    },

    // List
    listContainer: {
      marginVertical: 8,
      paddingLeft: 10
    },
    listItem: {
      flexDirection: 'row',
      marginBottom: 5,
      alignItems: 'flex-start'
    },
    listBullet: {
      width: 10,
      fontSize: 10,
      fontFamily: 'Helvetica-Bold'
    },
    listItemText: {
      fontSize: 10,
      lineHeight: 1.5,
      flex: 1
    },

    // Table
    table: {
      display: 'table',
      width: 'auto',
      marginVertical: 15,
      borderStyle: 'solid',
      borderWidth: 0.5,
      borderColor: palette.border,
      borderRadius: 6,
      overflow: 'hidden'
    },
    tableRowHeader: {
      flexDirection: 'row',
      backgroundColor: palette.cardBg
    },
    tableRow: {
      flexDirection: 'row'
    },
    tableColHeader: {
      borderStyle: 'solid',
      borderBottomWidth: 0.5,
      borderBottomColor: palette.border,
      flex: 1,
      padding: 6
    },
    tableCol: {
      borderStyle: 'solid',
      borderBottomWidth: 0.5,
      borderBottomColor: palette.border,
      flex: 1,
      padding: 6
    },
    tableCellHeader: {
      fontSize: 8.5,
      fontFamily: 'Helvetica-Bold',
      textTransform: 'uppercase',
      color: palette.textSecondary
    },
    tableCell: {
      fontSize: 9,
      color: palette.text
    },

    // Highlights & Sticky Notes inside PDF
    extraSection: {
      marginTop: 30,
      paddingTop: 15,
      borderTopWidth: 1,
      borderTopColor: palette.primary
    },
    extraTitle: {
      fontSize: 12,
      fontFamily: 'Helvetica-Bold',
      color: palette.primary,
      marginBottom: 10
    },
    stickyNoteCard: {
      backgroundColor: '#FEF08A', // Yellow Sticky Look
      borderWidth: 0.5,
      borderColor: '#CA8A04',
      borderRadius: 4,
      padding: 10,
      marginBottom: 8
    },
    stickyNoteTitle: {
      fontSize: 8,
      fontFamily: 'Helvetica-Bold',
      color: '#854D0E',
      marginBottom: 3
    },
    stickyNoteText: {
      fontSize: 9,
      color: '#1E293B'
    },
    highlightRow: {
      paddingVertical: 5,
      borderBottomWidth: 0.5,
      borderBottomColor: palette.border,
      flexDirection: 'row',
      alignItems: 'center'
    },
    highlightBullet: {
      width: 6,
      height: 6,
      borderRadius: 3,
      marginRight: 8
    }
  });
};

export default function NotesPdfDocument({ 
  metadata, 
  markdown, 
  highlights, 
  personalNotes, 
  options 
}) {
  const styles = createStyles(options);
  const blocks = parseMarkdownToBlocks(markdown);

  const getHighlightColorCode = (color) => {
    if (color === 'blue') return '#93C5FD';
    if (color === 'green') return '#86EFAC';
    if (color === 'pink') return '#FBCFE8';
    return '#FEF08A'; // yellow
  };

  return (
    <Document>
      {/* 1. Cover Page */}
      <Page size={options.paperSize} orientation={options.orientation} style={styles.coverPage}>
        <View>
          <Text style={styles.coverHeader}>CBSE Recall Revision Library</Text>
          <Text style={styles.coverTitle}>{metadata.title}</Text>
          <Text style={styles.coverSubtitle}>
            Subject: {metadata.subject} • Chapter {metadata.chapter} • Class {metadata.class}
          </Text>
          
          <View style={styles.coverBadge}>
            <Text style={styles.coverBadgeText}>{metadata.difficulty} Difficulty</Text>
          </View>

          <View style={styles.coverFooter}>
            <Text style={styles.coverFooterLeft}>CBSE RECALL</Text>
            <Text style={styles.coverFooterRight}>Generated on: {new Date().toLocaleDateString()}</Text>
          </View>
        </View>
      </Page>

      {/* 2. Main Content Page(s) */}
      <Page size={options.paperSize} orientation={options.orientation} style={styles.page}>
        
        {/* Header */}
        <View style={styles.header} fixed>
          <Text>CBSE RECALL NOTES</Text>
          <Text>{metadata.subject} — {metadata.title}</Text>
        </View>

        {/* Content Blocks */}
        <View>
          {blocks.map((block, idx) => {
            if (block.type === 'heading') {
              const text = cleanMathExpressions(block.text);
              if (block.level === 1) return <Text key={idx} style={styles.h1}>{text}</Text>;
              if (block.level === 2) return <Text key={idx} style={styles.h2}>{text}</Text>;
              return <Text key={idx} style={styles.h3}>{text}</Text>;
            }

            if (block.type === 'paragraph') {
              const text = cleanMathExpressions(block.text);
              return <Text key={idx} style={styles.p}>{text}</Text>;
            }

            if (block.type === 'divider') {
              return <View key={idx} style={styles.divider} />;
            }

            if (block.type === 'list') {
              return (
                <View key={idx} style={styles.listContainer}>
                  {block.items.map((item, i) => (
                    <View key={i} style={styles.listItem}>
                      <Text style={styles.listBullet}>
                        {block.ordered ? `${i + 1}.` : '•'}
                      </Text>
                      <Text style={styles.listItemText}>{cleanMathExpressions(item)}</Text>
                    </View>
                  ))}
                </View>
              );
            }

            if (block.type === 'callout') {
              const text = cleanMathExpressions(block.lines.join(' '));
              // Extract type
              const firstWord = text.split(/[\s:\-\n]+/)[0];
              const types = ['Important', 'Remember', 'Exam Tip', 'Formula', 'Trick', 'Common Mistake'];
              const matchedType = types.find(t => text.toLowerCase().startsWith(t.toLowerCase())) || 'Important';
              const cleanText = text.substring(matchedType.length).replace(/^[\s:\-\n]+/, '');

              return (
                <View key={idx} style={styles.calloutContainer}>
                  <Text style={styles.calloutTitle}>{matchedType}</Text>
                  <Text style={styles.calloutText}>{cleanText}</Text>
                </View>
              );
            }

            if (block.type === 'code') {
              return (
                <View key={idx} style={styles.codeBlock}>
                  <Text style={styles.codeText}>{block.codeLines.join('\n')}</Text>
                </View>
              );
            }

            if (block.type === 'table') {
              return (
                <View key={idx} style={styles.table}>
                  {/* Table Header */}
                  <View style={styles.tableRowHeader}>
                    {block.headers.map((h, i) => (
                      <View key={i} style={styles.tableColHeader}>
                        <Text style={styles.tableCellHeader}>{cleanMathExpressions(h)}</Text>
                      </View>
                    ))}
                  </View>
                  
                  {/* Table Rows */}
                  {block.rows.map((row, rIdx) => (
                    <View key={rIdx} style={styles.tableRow}>
                      {row.map((cell, cIdx) => (
                        <View key={cIdx} style={styles.tableCol}>
                          <Text style={styles.tableCell}>{cleanMathExpressions(cell)}</Text>
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              );
            }

            return null;
          })}
        </View>

        {/* Append Highlights if option is checked */}
        {options.includeHighlights && highlights.length > 0 && (
          <View style={styles.extraSection} break>
            <Text style={styles.extraTitle}>Highlighted Key Concepts</Text>
            {highlights.map((hl) => (
              <View key={hl.id} style={styles.highlightRow}>
                <View style={[styles.highlightBullet, { backgroundColor: getHighlightColorCode(hl.color) }]} />
                <Text style={[styles.p, { flex: 1, margin: 0 }]}>"{hl.text}"</Text>
              </View>
            ))}
          </View>
        )}

        {/* Append Personal Sticky Notes if option is checked */}
        {options.includeNotes && personalNotes.length > 0 && (
          <View style={styles.extraSection} break>
            <Text style={styles.extraTitle}>Personal Sticky Notes</Text>
            {personalNotes.map((note) => (
              <View key={note.id} style={styles.stickyNoteCard}>
                <Text style={styles.stickyNoteTitle}>📍 {note.sectionId ? note.sectionId.replace(/-/g, ' ') : 'General'}</Text>
                <Text style={styles.stickyNoteText}>{note.text}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>CBSE Recall v1.0 • Offline Study Notes</Text>
          <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
            `Page ${pageNumber} of ${totalPages}`
          )} />
        </View>

      </Page>
    </Document>
  );
}
export { cleanMathExpressions };
