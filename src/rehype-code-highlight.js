import { all, createLowlight } from 'lowlight';

const highlighter = createLowlight(all);
const aliases = { 'c++':'cpp', 'c#':'csharp', react:'jsx', javescript:'javascript', tyscript:'typescript' };
highlighter.register('url', () => ({
  name: 'URL',
  contains: [
    { scope:'keyword', begin:/[a-z][a-z0-9+.-]*:\/\//i },
    { scope:'attr', begin:/[?&][^=&#\s]+(?==)/ },
    { scope:'string', begin:/=/, end:/(?=[&#\s]|$)/ },
    { scope:'symbol', begin:/#[^\s]*/ },
    { scope:'number', begin:/%[0-9a-f]{2}/i },
  ],
}));

// Highlight fenced blocks only. Inline code, unknown languages and math stay intact.
export default function rehypeCodeHighlight() {
  return function walk(node, parent) {
    if (node.type === 'element' && node.tagName === 'code' && parent?.tagName === 'pre') {
      const classes = node.properties?.className || [];
      const label = classes.find(value => value.startsWith('language-'))?.slice(9).toLowerCase();
      const language = aliases[label] || label;
      if (language && highlighter.registered(language) && node.children.every(child => child.type === 'text')) {
        const source = node.children.map(child => child.value).join('');
        node.children = highlighter.highlight(language, source).children;
        node.properties.className = [...classes, 'hljs'];
      }
      return;
    }
    for (const child of node.children || []) walk(child, node);
  };
}
