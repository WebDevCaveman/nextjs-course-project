"use client";

import AuthForm from "@/components/forms/AuthForm";
import SocialAuthForm from "@/components/forms/SocialAuthForm";
import { signInSchema } from "@/lib/validations";

const SignIn = () => {
  return (
    <>
      <AuthForm
        formType="SIGN_IN"
        schema={signInSchema}
        defaultValues={{ email: "", password: "" }}
        onSubmit={(data) => Promise.resolve({ success: true, data })}
      />
      <SocialAuthForm />
    </>
  );
};

export default SignIn;
