"use client";

import { uiIcons } from "@/components/icons/huge/data/ui";
import { HugeIconSvg } from "@/components/icons/huge/HugeIconSvg";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { askQuestionSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

const QuestionForm = () => {
  const handleCreateQuestion = () => {};

  const form = useForm({
    resolver: zodResolver(askQuestionSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: [] as string[],
    },
  });

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
              <FieldLabel htmlFor="content">
                Detailed explanation of your problem <span className="text-accent-solid">*</span>
              </FieldLabel>
              <Input {...field} id="content" aria-invalid={fieldState.invalid} />
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
                onKeyDown={(event) => {
                  if (event.key !== "Enter") return;
                  event.preventDefault();

                  const value = event.currentTarget.value.trim();
                  if (!value || field.value.includes(value)) return;

                  field.onChange([...field.value, value]);
                  event.currentTarget.value = "";
                }}
              />
              {field.value.length > 0 && (
                <ul className="flex list-none flex-wrap gap-2 pl-0">
                  {field.value.map((tag) => (
                    <li
                      key={tag}
                      className="bg-muted text-fg-muted inline-flex items-center gap-1.5 rounded-sm py-1 pr-1.5 pl-[10px] text-sm font-medium"
                    >
                      {tag}
                      <button
                        type="button"
                        aria-label={`Remove ${tag}`}
                        onClick={() => field.onChange(field.value.filter((t) => t !== tag))}
                      >
                        <HugeIconSvg icon={uiIcons.close} size={11} />
                      </button>
                    </li>
                  ))}
                </ul>
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
