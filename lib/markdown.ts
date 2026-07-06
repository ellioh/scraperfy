export function renderMarkdown(raw: string): string {
  function inlineFmt(text: string): string {
    return text
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
      .replace(/\*([^*\n]+?)\*/g, '<em class="text-gray-300 italic">$1</em>')
      .replace(
        /`([^`]+)`/g,
        '<code class="bg-gray-800 text-emerald-400 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>'
      )
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" class="text-emerald-400 hover:text-emerald-300 underline" target="_blank" rel="noopener noreferrer">$1</a>'
      );
  }

  function escHtml(s: string): string {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  const blocks = raw.trim().split(/\n{2,}/);

  return blocks
    .map((block) => {
      const b = block.trim();
      if (!b) return "";

      if (b.startsWith("```")) {
        const firstNl = b.indexOf("\n");
        const lastFence = b.lastIndexOf("```");
        const code =
          firstNl !== -1 && lastFence > firstNl
            ? b.slice(firstNl + 1, lastFence).trimEnd()
            : b.slice(4);
        return `<pre class="bg-gray-800/80 border border-gray-700/50 rounded-xl p-5 overflow-x-auto text-sm font-mono text-emerald-300 my-6 leading-relaxed whitespace-pre"><code>${escHtml(code)}</code></pre>`;
      }

      if (b.startsWith("## ")) {
        return `<h2 class="text-2xl font-bold text-white mt-10 mb-4 leading-snug">${inlineFmt(b.slice(3))}</h2>`;
      }

      if (b.startsWith("### ")) {
        return `<h3 class="text-xl font-semibold text-gray-100 mt-8 mb-3">${inlineFmt(b.slice(4))}</h3>`;
      }

      const lines = b.split("\n");

      if (lines.every((l) => l.trimStart().startsWith("- "))) {
        const items = lines
          .map(
            (l) =>
              `<li class="flex items-start gap-2.5 text-gray-300 leading-relaxed"><span class="text-emerald-400 mt-1.5 shrink-0 text-xs">◆</span><span>${inlineFmt(l.trimStart().slice(2))}</span></li>`
          )
          .join("");
        return `<ul class="space-y-2.5 my-6 list-none">${items}</ul>`;
      }

      if (lines.some((l) => l.trimStart().startsWith("- "))) {
        let html = "";
        let textBuf: string[] = [];
        let listBuf: string[] = [];

        const flushText = () => {
          if (textBuf.length) {
            html += `<p class="text-gray-400 leading-relaxed mb-4">${inlineFmt(textBuf.join(" "))}</p>`;
            textBuf = [];
          }
        };
        const flushList = () => {
          if (listBuf.length) {
            const items = listBuf
              .map(
                (l) =>
                  `<li class="flex items-start gap-2.5 text-gray-300 leading-relaxed"><span class="text-emerald-400 mt-1.5 shrink-0 text-xs">◆</span><span>${inlineFmt(l.slice(2))}</span></li>`
              )
              .join("");
            html += `<ul class="space-y-2.5 my-4 list-none">${items}</ul>`;
            listBuf = [];
          }
        };

        for (const l of lines) {
          if (l.trimStart().startsWith("- ")) {
            flushText();
            listBuf.push(l.trimStart());
          } else {
            flushList();
            textBuf.push(l);
          }
        }
        flushText();
        flushList();
        return html;
      }

      return `<p class="text-gray-400 leading-relaxed mb-6">${inlineFmt(lines.join(" "))}</p>`;
    })
    .filter(Boolean)
    .join("\n");
}
