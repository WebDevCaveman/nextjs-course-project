"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ROUTES from "@/constants/routes";
import { updateUser } from "@/lib/actions/user.action";
import { EditProfileSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const ProfileForm = ({ user }: { user: User }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      name: user.name || "",
      username: user.username || "",
      portfolio: user.portfolio || "",
      location: user.location || "",
      bio: user.bio || "",
    },
  });

  const handleUpdateProfile = async (data: z.infer<typeof EditProfileSchema>) => {
    startTransition(async () => {
      const result = await updateUser(data);

      if (result.success) {
        toast.success("Profile updated successfully!");
        router.push(ROUTES.PROFILE(user._id));
      } else {
        toast.error(result.error?.message || "Failed to update profile. Please try again.");
      }
    });
  };

  return (
    <form className="flex flex-col gap-9" onSubmit={form.handleSubmit(handleUpdateProfile)}>
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">
                Name <span className="text-accent-solid">*</span>
              </FieldLabel>
              <Input {...field} id="name" aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="username"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="username">
                Username <span className="text-accent-solid">*</span>
              </FieldLabel>
              <Input {...field} id="username" aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="portfolio"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="portfolio">Portfolio Link</FieldLabel>
              <Input {...field} id="portfolio" placeholder="https://" aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="location"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="location">Location</FieldLabel>
              <Input {...field} id="location" aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="bio"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="bio">Bio</FieldLabel>
              <Textarea {...field} id="bio" aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Button type="submit" variant="cta" size="cta" className="self-end" disabled={isPending}>
        {isPending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
};

export default ProfileForm;
