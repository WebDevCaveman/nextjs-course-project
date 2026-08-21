"use client";

import AuthForm from "@/components/forms/AuthForm";
import { ForgotPasswordSchema } from "@/lib/validations";

const ForgotPassword = () => {
  return (
    <AuthForm
      formType="FORGOT_PASSWORD"
      schema={ForgotPasswordSchema}
      defaultValues={{ email: "" }}
      onSubmit={() => Promise.resolve({ success: true })}
    />
  );
};

export default ForgotPassword;
