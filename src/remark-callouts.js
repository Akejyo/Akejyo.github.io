// Convert only a supported marker at the start of a Markdown blockquote.
export default function remarkCallouts() {
  return function walk(node) {
    if (node.type === 'blockquote') {
      const paragraph = node.children[0];
      const first = paragraph?.children?.[0];
      const match = paragraph?.type === 'paragraph' && first?.type === 'text'
        && first.value.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](?:\r?\n|$)/i);
      if (match) {
        const kind = match[1].toLowerCase();
        first.value = first.value.slice(match[0].length);
        if (!first.value) paragraph.children.shift();
        if (!paragraph.children.length) node.children.shift();
        node.data = { ...node.data, hName: 'aside', hProperties: { className: ['article-callout', `article-callout-${kind}`] } };
        node.children.unshift({
          type: 'paragraph',
          data: { hProperties: { className: ['article-callout-title'] } },
          children: [{ type: 'text', value: kind[0].toUpperCase() + kind.slice(1) }],
        });
      }
    }
    for (const child of node.children || []) walk(child);
  };
}
