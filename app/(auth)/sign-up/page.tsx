"use client";
import AuthForm from "@/components/forms/AuthForm";
import SocialAuthForm from "@/components/forms/SocialAuthForm";
import { SignUpSchema } from "@/lib/validations";
import { signUpWithCredentials } from "@/lib/actions/auth.action";

const SignUp = () => {
  return (
    <>
      <AuthForm
        formType="SIGN_UP"
        schema={SignUpSchema}
        defaultValues={{ email: "", password: "", username: "", name: "" }}
        onSubmit={signUpWithCredentials}
      />
      <SocialAuthForm />
    </>
  );
};

export default SignUp;
