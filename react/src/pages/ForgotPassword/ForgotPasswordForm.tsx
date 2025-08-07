import type { ButtonGroup, FieldGroup } from "@/types/form";
import React, { type FormEvent } from "react";
import Form from "@/components/ui/form/Form";
import { z } from "zod";

interface ForgotProps extends React.ComponentProps<"div"> {
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  handleBack: () => void;
}

const forgotSchema = z.object({
  email: z.string().email("The email is invalid"),
});

function ForgotPasswordForm({ handleSubmit, handleBack }: ForgotProps) {
  const fields: FieldGroup[] = [
    {
      element: "input",
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "m@example.com",
      required: true,
    },
  ];

  const buttons: ButtonGroup[] = [
    [
      {
        text: "Back",
        type: "button",
        variant: "outline",
        onClick: handleBack,
      },
      {
        text: "Send",
        type: "submit",
        variant: "accent",
      },
    ],
  ];

  return (
    <Form
      variant="card"
      name="forgot-password"
      title="Forgot Password"
      description="We will send a reset password link to your email"
      fields={fields}
      buttons={buttons}
      handleSubmit={handleSubmit}
      schema={forgotSchema}
    />
  );
}

export default ForgotPasswordForm;
