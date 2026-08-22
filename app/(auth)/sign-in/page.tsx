"use client";

import AuthForm from "@/components/forms/AuthForm";
import SocialAuthForm from "@/components/forms/SocialAuthForm";
import { SignInSchema } from "@/lib/validations";
import { signInWithCredentials } from "@/lib/actions/auth.actions";

const SignIn = () => {
  return (
    <>
      <AuthForm
        formType="SIGN_IN"
        schema={SignInSchema}
        defaultValues={{ email: "", password: "" }}
        onSubmit={signInWithCredentials}
      />
      <SocialAuthForm />
    </>
  );
};

export default SignIn;
