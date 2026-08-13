"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import type { DefaultValues, FieldValues, Path, SubmitHandler } from "react-hook-form";
import type { ZodType } from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import ROUTES from "@/constants/routes";

interface AuthFormTypes<T extends FieldValues> {
  formType: "SIGN_IN" | "SIGN_UP";
  schema: ZodType<T, T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean; data: T }>;
}

const AuthForm = <T extends FieldValues>({ formType, schema, defaultValues, onSubmit }: AuthFormTypes<T>) => {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    // TODO: Authenticate User
    await onSubmit(data);
  };

  const buttonText = formType === "SIGN_IN" ? "Sign In" : "Sign Up";

  return (
    <form className="flex flex-col gap-6" onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl leading-[1.3] font-bold tracking-[-0.4px]">
          {formType === "SIGN_IN" ? "Sign in" : "Sign up"}
        </h1>
        <p className="leading-[1.4]">to continue to DevFlow</p>
      </div>

      <FieldGroup>
        {Object.keys(defaultValues).map((name) => (
          <Controller
            key={name}
            name={name as Path<T>}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={name}>{name.charAt(0).toUpperCase() + name.slice(1)}</FieldLabel>
                <Input
                  {...field}
                  required
                  id={name}
                  variant="auth"
                  type={name === "password" ? "password" : name === "email" ? "email" : "text"}
                  autoComplete={
                    name === "password" ? (formType === "SIGN_IN" ? "current-password" : "new-password") : name
                  }
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        ))}

        {formType === "SIGN_IN" && (
          <Link href={ROUTES.FORGOT_PASSWORD} className="self-end text-[13px]">
            Forgot password?
          </Link>
        )}
      </FieldGroup>

      <Button type="submit" variant="cta" size="auth" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? `${buttonText}...` : buttonText}
      </Button>

      <p className="text-center text-sm">
        {formType === "SIGN_IN" ? (
          <>
            Don&apos;t have an account? <Link href={ROUTES.SIGN_UP}>Sign up</Link>
          </>
        ) : (
          <>
            Already have an account? <Link href={ROUTES.SIGN_IN}>Sign in</Link>
          </>
        )}
      </p>
    </form>
  );
};

export default AuthForm;
