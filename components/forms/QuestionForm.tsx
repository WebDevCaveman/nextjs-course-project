"use client";

import TagList from "@/components/tag-list/TagList";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AskQuestionSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useRef, useTransition } from "react";
import { MDXEditorMethods } from "@mdxeditor/editor";
import dynamic from "next/dynamic";
import * as z from "zod";
import { createQuestion } from "@/lib/actions/question.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ROUTES from "@/constants/routes";

const Editor = dynamic(() => import("@/components/editor"), {
  // Make sure we turn SSR off
  ssr: false,
});

const QuestionForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

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

  const handleCreateQuestion = async (data: z.infer<typeof AskQuestionSchema>) => {
    // Jeśli ubierzemy to w startTransition, to nie będziemy blokować UI i będzie to działać w tle, a my potem mozemy uzyc isPending, zeby wylaczyc button submit i pokazac odpowiedni text. Jest to dobre podejscie bo mamy pewnosc, ze stan isPending bedzie trwal tak dlugo, az cala nasza akcja sie nie wykona, czyli u nas az do momentu utworzenia calego pytania.
    startTransition(async () => {
      const result = await createQuestion(data);

      if (result.success) {
        toast.success("Question created successfully!");
        form.reset();
        router.push(ROUTES.QUESTION(result.data!._id.toString()));
      } else {
        toast.error(result.error?.message || "Failed to create question. Please try again.");
      }
    });
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

      <Button type="submit" variant="cta" size="cta" className="self-end" disabled={isPending}>
        {isPending ? "Submitting..." : "Ask a Question"}
      </Button>
    </form>
  );
};

export default QuestionForm;
