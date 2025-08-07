import type { ButtonGroup, FieldGroup } from "@/types/form";
import Form from "@/components/ui/form/Form";
import type { FormEvent } from "react";
import sdworxSchema from "./SDWorxSchema";

interface SDWorxProps extends React.ComponentProps<"div"> {
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  handleBack: () => void;
}

function SDWorxForm({ handleSubmit, handleBack }: SDWorxProps) {
  const fields: FieldGroup[] = [
    {
      element: "input",
      name: "sd_username",
      placeholder: "Your SD Worx username",
      label: "Username",
      type: "text",
      required: true,
    },
    {
      element: "input",
      name: "sd_password",
      placeholder: "Your SD Worx password",
      label: "Password",
      type: "password",
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
        text: "Submit",
        type: "submit",
        variant: "accent",
      },
    ],
  ];
  return (
    <Form
      variant="card"
      name="sdworx"
      title="SD Worx"
      description="Enter the details that you use to log into SD Worx (payslip website)"
      fields={fields}
      handleSubmit={handleSubmit}
      buttons={buttons}
      schema={sdworxSchema}
      refreshes={false}
    />
  );
}

export default SDWorxForm;
