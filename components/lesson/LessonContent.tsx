import { Fragment } from "react";

function CodeBlock({ language, code }: { language?: string; code: string }) {
  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-slate-800 bg-[#0b1f3a] shadow-sm">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-300">
          {language || "code"}
        </span>
        <span className="text-[10px] font-bold text-slate-500">UTECH</span>
      </div>
      <pre className="overflow-x-auto p-5 text-sm leading-7 text-slate-100"><code>{code}</code></pre>
    </div>
  );
}

function renderBlocks(content: string) {
  const lines = content.replace(/\r
/g, "
").split("
");
  const blocks: React.ReactNode[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];
  let code: string[] = [];
  let codeLanguage = "";
  let inCode = false;

  const flushParagraph = () => {
    if (!paragraph.length) return;
    blocks.push(
      <p key={blocks.length} className="my-4 leading-8 text-slate-700">
        {paragraph.join(" ")}
      </p>
    );
    paragraph = [];
  };

  const flushList = () => {
    if (!list.length) return;
    blocks.push(
      <ul key={blocks.length} className="my-5 space-y-2 pl-6 text-slate-700">
        {list.map((item, index) => (
          <li key={index} className="list-disc pl-1 leading-7">{item}</li>
        ))}
      </ul>
    );
    list = [];
  };

  const flushCode = () => {
    blocks.push(<CodeBlock key={blocks.length} language={codeLanguage} code={code.join("
")} />);
    code = [];
    codeLanguage = "";
  };

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      if (inCode) flushCode();
      else {
        flushParagraph();
        flushList();
        inCode = true;
        codeLanguage = trimmed.slice(3).trim();
      }
      return;
    }

    if (inCode) {
      code.push(line);
      return;
    }

    if (!trimmed) {
      flushParagraph();
      flushList();
      return;
    }

    if (trimmed.startsWith("# ")) {
      flushParagraph();
      flushList();
      blocks.push(
        <h2 key={blocks.length} className="mt-8 text-2xl font-black tracking-tight text-[#0b1f3a]">
          {trimmed.slice(2)}
        </h2>
      );
      return;
    }

    if (trimmed.startsWith("## ")) {
      flushParagraph();
      flushList();
      blocks.push(
        <h3 key={blocks.length} className="mt-7 text-xl font-extrabold text-[#0b1f3a]">
          {trimmed.slice(3)}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith("> ")) {
      flushParagraph();
      flushList();
      blocks.push(
        <div key={blocks.length} className="my-5 rounded-xl border border-blue-100 bg-[#f5f8fc] px-5 py-4 leading-7 text-slate-700">
          <span className="font-extrabold text-[#155eef]">Note: </span>
          {trimmed.slice(2)}
        </div>
      );
      return;
    }

    if (trimmed.startsWith("- ")) {
      flushParagraph();
      list.push(trimmed.slice(2));
      return;
    }

    paragraph.push(trimmed);
  });

  if (inCode) flushCode();
  flushParagraph();
  flushList();

  return blocks;
}

export default function LessonContent({ content }: { content: string }) {
  return (
    <div className="text-[16px]">
      {renderBlocks(content).map((block, index) => (
        <Fragment key={index}>{block}</Fragment>
      ))}
    </div>
  );
}
