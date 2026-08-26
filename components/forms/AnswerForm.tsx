"use client";

import { HugeIconSvg } from "@/components/icons/huge/HugeIconSvg";
import { uiIcons } from "@/components/icons/huge/data/ui";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { AnswerSchema } from "@/lib/validations";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MDXEditorMethods } from "@mdxeditor/editor";
import dynamic from "next/dynamic";
import { useRef, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { createAnswer } from "@/lib/actions/answer.action";

const Editor = dynamic(() => import("@/components/editor"), {
  // Make sure we turn SSR off
  ssr: false,
});

const AnswerForm = ({ questionId }: { questionId: string }) => {
  const [isAnswering, startAnsweringTransition] = useTransition();
  const [isAISubmitting, setIsAISubmitting] = useState(false);
  const form = useForm({
    resolver: zodResolver(AnswerSchema),
    defaultValues: { content: "" },
  });

  const editorRef = useRef<MDXEditorMethods>(null);

  const handleSubmit = async (values: z.infer<typeof AnswerSchema>) => {
    startAnsweringTransition(async () => {
      const result = await createAnswer({ questionId, content: values.content });

      if (result.success) {
        toast.success("Answer submitted successfully!");
        form.reset();
        editorRef.current?.setMarkdown("");
      } else {
        toast.error(result.error?.message || "Failed to submit answer.");
      }
    });
  };

  return (
    <form className="flex flex-col gap-9" onSubmit={(e) => form.handleSubmit(handleSubmit)(e)}>
      <Controller
        name="content"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <FieldLabel onClick={() => editorRef.current?.focus()}>
                Write your answer here <span className="text-accent-solid">*</span>
              </FieldLabel>
              <Button type="button" variant="outlineAccent" size="sm" disabled={isAISubmitting}>
                <HugeIconSvg icon={uiIcons.flash} size={16} />
                {isAISubmitting ? "Generating..." : "Generate with AI"}
              </Button>
            </div>
            <Editor value={field.value} editorRef={editorRef} fieldChange={field.onChange} />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Button type="submit" variant="cta" size="cta" className="self-end" disabled={isAnswering}>
        {isAnswering ? "Submitting..." : "Submit Answer"}
      </Button>
    </form>
  );
};

export default AnswerForm;
