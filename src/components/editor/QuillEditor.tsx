"use client";

import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

import { Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "../ui/skeleton";
import clsx from "clsx";

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isGenerating?: boolean;
  onGenerateAI?: () => void;
}

export default function QuillEditor({
  value,
  onChange,
  placeholder = "Start writing...",
  isGenerating = false,
  onGenerateAI,
}: QuillEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!editorRef.current || quillRef.current) return;

    const quill = new Quill(editorRef.current, {
      theme: "snow",
      placeholder,
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["blockquote", "code-block"],
          ["link", "image"],
          ["clean"],
        ],
      },
    });

    // Constrain the contenteditable area to a fixed height so it scrolls
    // internally. Target .ql-editor (not .ql-container) — this is the
    // correct element; Quill's snow theme already sets overflow-y: auto on it.
    const editor = editorRef.current.querySelector<HTMLElement>(".ql-editor");
    if (editor) {
      editor.style.height = "450px";
      editor.style.overflowY = "auto";
    }

    quill.on("text-change", () => {
      onChangeRef.current(quill.getSemanticHTML());
    });

    quillRef.current = quill;
  }, []);

  // Track whether the last change was programmatic so we can suppress
  // the equality guard that would otherwise block a re-paste.
  const isProgrammaticUpdate = useRef(false);

  useEffect(() => {
    const quill = quillRef.current;

    if (!quill) return;

    // Normalize both sides to avoid false "equal" mismatches between the
    // incoming HTML string and what Quill serialises back.
    const current = quill.getSemanticHTML().trim();
    const incoming = (value || "").trim();

    if (!isProgrammaticUpdate.current && current === incoming) return;

    isProgrammaticUpdate.current = true;

    // Make absolutely sure the editor is editable before pasting.
    quill.enable();

    quill.clipboard.dangerouslyPasteHTML(incoming);

    // Move cursor to the end so the user can start editing immediately.
    const length = quill.getLength();
    quill.setSelection(length, 0);

    // Emit a synthetic text-change so onChange is called with the new HTML
    // (dangerouslyPasteHTML fires text-change internally, but we reset the
    // flag here after a tick to avoid an infinite loop).
    setTimeout(() => {
      isProgrammaticUpdate.current = false;
      // Re-focus the editor after async operations (e.g. AI generation)
      // so the toolbar and cursor are immediately active.
      quill.focus();
    }, 0);
  }, [value]);

  return (
    <div className="overflow-hidden border bg-background">
      <div className="relative">
        <div
          ref={editorRef}
          className={clsx(
            "quill-editor transition-opacity",
            isGenerating && "opacity-0",
          )}
        />

        {isGenerating && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm">
            <Sparkles className="mb-4 h-10 w-10 animate-spin text-primary" />

            <h3 className="text-lg font-semibold">Generating your article</h3>

            <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
              Our AI is researching, organizing ideas, and writing a structured
              article. This usually takes a few seconds.
            </p>

            <div className="mt-8 w-full max-w-md space-y-3 px-8">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t bg-muted/30 px-4 py-3">
        <p className="text-xs text-muted-foreground">
          Need help writing your article?
        </p>

        <Button
          type="button"
          variant="secondary"
          onClick={onGenerateAI}
          disabled={isGenerating}
          className="cursor-pointer"
        >
          {isGenerating ? (
            <>
              <Sparkles className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Generate with AI
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
