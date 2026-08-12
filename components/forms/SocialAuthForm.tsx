// W naszym przypadku musimy wykorzystac client component, ale gosc w video pokazuje jak mozna to zamienic na server side component.
"use client";

const providerButton =
  "border-line-strong bg-base text-fg hover:border-accent-solid flex h-[45px] items-center justify-center gap-2.5 rounded-lg border text-[15px] font-medium";
import { signIn } from "next-auth/react";
import ROUTES from "@/constants/routes";
import { toast } from "sonner";

const SocialAuthForm = () => {
  const handleSignIn = async (provider: "github" | "google") => {
    try {
      await signIn(provider, { callbackUrl: ROUTES.HOME }); // Redirect to home page after successful sign-in
    } catch (error) {
      toast.error(`${error instanceof Error ? error.message : "Failed to sign in. Please try again."}`); // Show error toast
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3.5">
        <span className="bg-line h-px flex-1" />
        <span className="text-fg-subtle text-[13px]">or</span>
        <span className="bg-line h-px flex-1" />
      </div>

      <button type="button" className={providerButton} onClick={() => handleSignIn("github")}>
        <i className="devicon-github-original text-[20px]" />
        GitHub
      </button>
      <button type="button" className={providerButton} onClick={() => handleSignIn("google")}>
        <i className="devicon-google-plain colored text-[20px]" />
        Google
      </button>
    </div>
  );
};

export default SocialAuthForm;
