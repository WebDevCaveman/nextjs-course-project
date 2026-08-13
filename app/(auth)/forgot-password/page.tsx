"use client";

import AuthForm from "@/components/forms/AuthForm";
import { forgotPasswordSchema } from "@/lib/validations";

const ForgotPassword = () => {
  return (
    <AuthForm
      formType="FORGOT_PASSWORD"
      schema={forgotPasswordSchema}
      defaultValues={{ email: "" }}
      onSubmit={(data) => Promise.resolve({ success: true, data })}
    />
  );
};

export default ForgotPassword;
