export interface MarkdownNode {
  type: string;
  content?: string | MarkdownNode[];
  children?: MarkdownNode[];
  language?: string;
  align?: string;
  header?: MarkdownNode[];
  rows?: MarkdownNode[][];
}

export function markdownToJSX(markdown: string): React.ReactNode[] {
  const lines = markdown.split("\n");
  const nodes: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Headings
    if (line.startsWith("# ")) {
      nodes.push(
        <h1
          key={key++}
          className="mb-6 mt-8 text-3xl font-bold text-gray-900 dark:text-white"
        >
          {parseInline(line.substring(2))}
        </h1>
      );
      i++;
    } else if (line.startsWith("## ")) {
      nodes.push(
        <h2
          key={key++}
          className="mb-4 mt-6 text-2xl font-bold text-gray-900 dark:text-white"
        >
          {parseInline(line.substring(3))}
        </h2>
      );
      i++;
    } else if (line.startsWith("### ")) {
      nodes.push(
        <h3
          key={key++}
          className="mb-3 mt-5 text-xl font-bold text-gray-900 dark:text-white"
        >
          {parseInline(line.substring(4))}
        </h3>
      );
      i++;
    }
    // Code blocks
    else if (line.startsWith("```")) {
      const language = line.substring(3).trim() || "plaintext";
      const codeLines: string[] = [];
      i++;

      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }

      nodes.push(
        <div key={key++} className="my-4 overflow-hidden rounded-lg">
          <div className="flex items-center bg-gray-900 px-4 py-2 dark:bg-gray-800">
            <span className="text-sm font-semibold text-gray-400">
              {language}
            </span>
          </div>
          <pre className="overflow-x-auto bg-gray-50 p-4 text-sm dark:bg-gray-900">
            <code className="font-mono text-gray-900 dark:text-gray-100">
              {codeLines.join("\n")}
            </code>
          </pre>
        </div>
      );
      i++;
    }
    // Tables
    else if (line.includes("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].includes("|")) {
        tableLines.push(lines[i]);
        i++;
      }

      if (tableLines.length > 1) {
        const headers = tableLines[0]
          .split("|")
          .map((h) => h.trim())
          .filter(Boolean);
        const rows = tableLines.slice(2).map((row) =>
          row
            .split("|")
            .map((cell) => cell.trim())
            .filter(Boolean)
        );

        nodes.push(
          <div key={key++} className="my-4 overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  {headers.map((header, idx) => (
                    <th
                      key={idx}
                      className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900 dark:border-gray-600 dark:text-white"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                    {row.map((cell, cellIdx) => (
                      <td
                        key={cellIdx}
                        className="border border-gray-300 px-4 py-2 text-gray-700 dark:border-gray-600 dark:text-gray-300"
                      >
                        {parseInline(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
    }
    // Unordered lists
    else if (line.startsWith("- ") || line.startsWith("* ")) {
      const listItems: string[] = [];
      while (
        i < lines.length &&
        (lines[i].startsWith("- ") || lines[i].startsWith("* "))
      ) {
        listItems.push(lines[i].substring(2));
        i++;
      }

      nodes.push(
        <ul key={key++} className="mb-4 ml-6 list-disc space-y-2 text-gray-700 dark:text-gray-300">
          {listItems.map((item, idx) => (
            <li key={idx}>{parseInline(item)}</li>
          ))}
        </ul>
      );
    }
    // Ordered lists
    else if (/^\d+\. /.test(line)) {
      const listItems: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        listItems.push(lines[i].replace(/^\d+\. /, ""));
        i++;
      }

      nodes.push(
        <ol key={key++} className="mb-4 ml-6 list-decimal space-y-2 text-gray-700 dark:text-gray-300">
          {listItems.map((item, idx) => (
            <li key={idx}>{parseInline(item)}</li>
          ))}
        </ol>
      );
    }
    // Paragraphs
    else if (line.trim()) {
      nodes.push(
        <p key={key++} className="mb-4 text-gray-700 dark:text-gray-300">
          {parseInline(line)}
        </p>
      );
      i++;
    } else {
      i++;
    }
  }

  return nodes;
}

function parseInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  // Bold text **text**
  const boldRegex = /\*\*(.+?)\*\*/g;
  let boldMatch;
  const boldMatches = [];

  while ((boldMatch = boldRegex.exec(text)) !== null) {
    boldMatches.push({ start: boldMatch.index, end: boldMatch.index + boldMatch[0].length, text: boldMatch[1] });
  }

  // Inline code `code`
  const codeRegex = /`(.+?)`/g;
  let codeMatch;
  const codeMatches = [];

  while ((codeMatch = codeRegex.exec(text)) !== null) {
    codeMatches.push({ start: codeMatch.index, end: codeMatch.index + codeMatch[0].length, text: codeMatch[1] });
  }

  // Links [text](url)
  const linkRegex = /\[(.+?)\]\((.+?)\)/g;
  let linkMatch;
  const linkMatches = [];

  while ((linkMatch = linkRegex.exec(text)) !== null) {
    linkMatches.push({
      start: linkMatch.index,
      end: linkMatch.index + linkMatch[0].length,
      text: linkMatch[1],
      url: linkMatch[2],
    });
  }

  const allMatches = [...boldMatches, ...codeMatches, ...linkMatches].sort((a, b) => a.start - b.start);

  for (const match of allMatches) {
    if (match.start >= lastIndex) {
      if (match.start > lastIndex) {
        nodes.push(text.substring(lastIndex, match.start));
      }

      if ("url" in match) {
        nodes.push(
          <a
            key={key++}
            href={match.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            {match.text}
          </a>
        );
      } else if (match.start === (codeMatches.find((m) => m.start === match.start)?.start ?? -1)) {
        nodes.push(
          <code
            key={key++}
            className="rounded bg-gray-100 px-2 py-1 font-mono text-sm text-gray-900 dark:bg-gray-800 dark:text-gray-100"
          >
            {match.text}
          </code>
        );
      } else {
        nodes.push(
          <strong key={key++} className="font-bold">
            {match.text}
          </strong>
        );
      }

      lastIndex = match.end;
    }
  }

  if (lastIndex < text.length) {
    nodes.push(text.substring(lastIndex));
  }

  return nodes.length > 0 ? nodes : [text];
}
