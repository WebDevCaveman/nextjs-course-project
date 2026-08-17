"use client";
// InitializedMDXEditor.tsx
import type { ForwardedRef } from "react";
import { useTheme } from "next-themes";
import { basicDark } from "cm6-theme-basic-dark";
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  linkPlugin,
  linkDialogPlugin,
  imagePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  toolbarPlugin,
  BoldItalicUnderlineToggles,
  StrikeThroughSupSubToggles,
  BlockTypeSelect,
  ListsToggle,
  CreateLink,
  InsertImage,
  InsertCodeBlock,
  Separator,
  MDXEditor,
  type MDXEditorMethods,
} from "@mdxeditor/editor";

interface EditorProps {
  value: string;
  fieldChange: (value: string) => void;
  editorRef: ForwardedRef<MDXEditorMethods> | null;
}

// ponytail: MDXEditor spreads codeMirrorExtensions into a useEffect dep array, and React
// only compares deps up to the shorter array's length — a 0↔1 swap never re-runs the effect,
// so the code block keeps the old theme. Keeping the array at length 1 makes the swap visible.
const NO_THEME: never[] = [];

const CODE_BLOCK_LANGUAGES = {
  "": "Plain text",
  js: "JavaScript",
  jsx: "JavaScript (React)",
  ts: "TypeScript",
  tsx: "TypeScript (React)",
  html: "HTML",
  css: "CSS",
  json: "JSON",
  python: "Python",
  sql: "SQL",
  bash: "Bash",
};

// Only import this to the next file
const Editor = ({ value, fieldChange, editorRef, ...props }: EditorProps) => {
  const { resolvedTheme } = useTheme();

  return (
    <div className="border-line bg-background overflow-hidden rounded-xl border">
      <MDXEditor
        markdown={value}
        onChange={fieldChange}
        contentEditableClassName="min-h-[240px] px-4 py-4 text-base leading-[1.5]"
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          imagePlugin(),
          codeBlockPlugin({ defaultCodeBlockLanguage: "" }),
          codeMirrorPlugin({
            codeBlockLanguages: CODE_BLOCK_LANGUAGES,
            codeMirrorExtensions: [resolvedTheme === "dark" ? basicDark : NO_THEME],
          }),
          markdownShortcutPlugin(),
          toolbarPlugin({
            toolbarClassName: "border-line bg-subtle flex flex-wrap items-center gap-1 border-b px-3 py-2",
            toolbarContents: () => (
              <>
                <BoldItalicUnderlineToggles options={["Bold", "Italic"]} />
                <StrikeThroughSupSubToggles options={["Strikethrough"]} />
                <Separator />
                <BlockTypeSelect />
                <Separator />
                <ListsToggle options={["bullet", "number"]} />
                <Separator />
                <CreateLink />
                <InsertImage />
                <Separator />
                <InsertCodeBlock />
              </>
            ),
          }),
        ]}
        {...props}
        ref={editorRef}
      />
    </div>
  );
};

export default Editor;
