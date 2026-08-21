"use client";

import TagList from "@/components/tag-list/TagList";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AskQuestionSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useRef } from "react";
import { MDXEditorMethods } from "@mdxeditor/editor";
import dynamic from "next/dynamic";
import * as z from "zod";

const Editor = dynamic(() => import("@/components/editor"), {
  // Make sure we turn SSR off
  ssr: false,
});

const QuestionForm = () => {
  const form = useForm({
    resolver: zodResolver(AskQuestionSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: [] as string[],
    },
  });

  const editorRef = useRef<MDXEditorMethods>(null);

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, field: { value: string[] }) => {
    form.clearErrors("tags");

    if (event.key === "Enter") {
      event.preventDefault();
      const tagInput = event.currentTarget.value.trim().toLowerCase();

      if (tagInput && tagInput.length <= 15 && !field.value.includes(tagInput)) {
        form.setValue("tags", [...field.value, tagInput], {
          shouldValidate: true,
        });
        event.currentTarget.value = "";
      } else if (tagInput.length > 15) {
        form.setError("tags", {
          type: "manual",
          message: "Tag should be less than 15 characters",
        });
      } else if (field.value.includes(tagInput)) {
        form.setError("tags", {
          type: "manual",
          message: "Tag already exists",
        });
      }
    }
  };

  const handleTagRemove = (tag: string, field: { value: string[] }) => {
    form.setValue(
      "tags",
      field.value.filter((t) => t !== tag),
      { shouldValidate: true }
    );
  };

  const handleCreateQuestion = (data: z.infer<typeof AskQuestionSchema>) => {
    console.log(data);
  };

  return (
    <form className="flex flex-col gap-9" onSubmit={form.handleSubmit(handleCreateQuestion)}>
      <FieldGroup>
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="title">
                Question Title <span className="text-accent-solid">*</span>
              </FieldLabel>
              <Input {...field} id="title" aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="content"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel onClick={() => editorRef.current?.focus()}>
                Detailed explanation of your problem <span className="text-accent-solid">*</span>
              </FieldLabel>
              <Editor value={field.value} editorRef={editorRef} fieldChange={field.onChange} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="tags"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="tags">
                Tags <span className="text-accent-solid">*</span>
              </FieldLabel>
              <Input
                id="tags"
                placeholder="Add tags..."
                aria-invalid={fieldState.invalid}
                onKeyDown={(event) => handleInputKeyDown(event, field)}
              />
              {field.value.length > 0 && (
                <TagList
                  tags={field.value.map((tag) => ({ _id: tag, name: tag }))}
                  inline
                  onRemove={(tag) => handleTagRemove(tag, field)}
                />
              )}
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Button type="submit" variant="cta" size="cta" className="self-end" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Submitting..." : "Ask a Question"}
      </Button>
    </form>
  );
};

export default QuestionForm;
