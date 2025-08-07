import Form from "@/components/ui/form/Form";
import type { ButtonGroup, FieldGroup } from "@/types/form";
import type { ComponentProps } from "react";

interface FormProps extends ComponentProps<"div"> {
  handleSubmit: () => void;
}

function ResetPasswordForm({ handleSubmit }: FormProps) {
  const fields: FieldGroup[] = [
    {
      element: "input",
      name: "password",
      label: "Password",
      placeholder: "Your password",
    },
    {
      element: "input",
      name: "confirmPassword",
      label: "Confirm Password",
      placeholder: "Confirm password",
    },
  ];

  const buttons: ButtonGroup[] = [
    [
      {
        type: "button",
        text: "Back",
        variant: "outline",
      },
      {
        type: "submit",
        text: "Reset",
        variant: "accent",
      },
    ],
  ];

  return (
    <Form
      variant="card"
      name="reset-password"
      title="Reset password"
      description="Reset your password"
      fields={fields}
      buttons={buttons}
      handleSubmit={handleSubmit}
    />
  );
}

export default ResetPasswordForm;
