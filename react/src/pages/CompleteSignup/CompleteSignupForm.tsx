import Form from "@/components/ui/form/Form";
import type { ButtonGroup, FieldGroup } from "@/types/form";
import type { ComponentProps, FormEvent } from "react";

interface CompleteSignupProps extends ComponentProps<"div"> {
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

function CompleteSignupForm({ handleSubmit }: CompleteSignupProps) {
  const fields: FieldGroup[] = [
    {
      element: "input",
      name: "username",
      label: "Username",
      type: "text",
      placeholder: "Your username",
      required: true,
    },
    {
      element: "input",
      name: "nickname",
      label: "Nickname",
      type: "text",
      placeholder: "Your nickname",
      required: true,
    },
  ];

  const buttons: ButtonGroup[] = [
    {
      text: "Submit",
      type: "submit",
      variant: "accent",
    },
  ];

  return (
    <Form
      variant="card"
      name="complete-signup"
      title="Profile Details"
      fields={fields}
      buttons={buttons}
      handleSubmit={handleSubmit}
    />
  );
}

export default CompleteSignupForm;
