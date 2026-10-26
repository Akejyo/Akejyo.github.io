import { valueToEstree } from "estree-util-value-to-estree";

function parseStyle(style) {
  const result = {};

  for (const declaration of style.split(";")) {
    const index = declaration.indexOf(":");
    if (index < 0) continue;

    const property = declaration.slice(0, index).trim();
    const value = declaration.slice(index + 1).trim();

    if (!property || !value) continue;

    const key = property.startsWith("--")
      ? property
      : property.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

    result[key] = value;
  }

  return result;
}

export default function remarkTyporaStyle() {
  return (tree) => {
    function visit(node) {
      if (
        node.type === "mdxJsxFlowElement" ||
        node.type === "mdxJsxTextElement"
      ) {
        for (const attribute of node.attributes || []) {
          if (
            attribute.type !== "mdxJsxAttribute" ||
            attribute.name !== "style" ||
            typeof attribute.value !== "string"
          ) {
            continue;
          }

          const style = parseStyle(attribute.value);
          const expression = JSON.stringify(style);

          attribute.value = {
            type: "mdxJsxAttributeValueExpression",
            value: expression,
            data: {
              estree: {
                type: "Program",
                sourceType: "module",
                body: [
                  {
                    type: "ExpressionStatement",
                    expression: valueToEstree(style),
                  },
                ],
              },
            },
          };
        }
      }

      for (const child of node.children || []) {
        visit(child);
      }
    }

    visit(tree);
  };
}
