"use client";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import type { DefaultValues, FieldValues, Path, SubmitHandler } from "react-hook-form";
import type { ZodType } from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import ROUTES from "@/constants/routes";
import { toast } from "sonner";

const COPY = {
  SIGN_IN: {
    title: "Sign in",
    subtitle: "to continue to DevFlow",
    button: "Sign In",
    footer: "Don't have an account?",
    footerHref: ROUTES.SIGN_UP,
    footerLink: "Sign up",
  },
  SIGN_UP: {
    title: "Sign up",
    subtitle: "to continue to DevFlow",
    button: "Sign Up",
    footer: "Already have an account?",
    footerHref: ROUTES.SIGN_IN,
    footerLink: "Sign in",
  },
  FORGOT_PASSWORD: {
    title: "Forgot password?",
    subtitle: "We'll email you a link to reset it",
    button: "Send reset link",
    footer: "Remember your password?",
    footerHref: ROUTES.SIGN_IN,
    footerLink: "Sign in",
  },
} as const;

interface AuthFormTypes<T extends FieldValues> {
  formType: keyof typeof COPY;
  schema: ZodType<T, T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<ActionResponse>;
}

const AuthForm = <T extends FieldValues>({ formType, schema, defaultValues, onSubmit }: AuthFormTypes<T>) => {
  const router = useRouter();

  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    const result = await onSubmit(data);
    if (result.success) {
      toast.success(`${formType === "SIGN_IN" ? "Signed in" : "Signed up"} successfully!`);
      router.push(ROUTES.HOME);
    } else {
      toast.error(`${result?.error?.message ?? "An error occurred"}`);
    }
  };

  const copy = COPY[formType];

  return (
    <form className="flex flex-col gap-6" onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl leading-[1.3] font-bold tracking-[-0.4px]">{copy.title}</h1>
        <p className="leading-[1.4]">{copy.subtitle}</p>
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
        {form.formState.isSubmitting ? `${copy.button}...` : copy.button}
      </Button>

      <p className="text-center text-sm">
        {copy.footer} <Link href={copy.footerHref}>{copy.footerLink}</Link>
      </p>
    </form>
  );
};

export default AuthForm;
