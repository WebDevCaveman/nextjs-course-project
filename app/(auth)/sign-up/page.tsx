"use client";

import AuthForm from "@/components/forms/AuthForm";
import SocialAuthForm from "@/components/forms/SocialAuthForm";
import { signUpSchema } from "@/lib/validations";

const SignUp = () => {
  return (
    <>
      <AuthForm
        formType="SIGN_UP"
        schema={signUpSchema}
        defaultValues={{ email: "", password: "", username: "", name: "" }}
        onSubmit={(data) => Promise.resolve({ success: true, data })}
      />
      <SocialAuthForm />
    </>
  );
};

export default SignUp;
