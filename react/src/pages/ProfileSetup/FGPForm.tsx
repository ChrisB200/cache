import type { ButtonGroup, FieldGroup } from "@/types/form";
import Form from "@/components/ui/form/Form";
import type { FormEvent } from "react";
import fgpSchema from "./FGPSchema";

interface FGPProps extends React.ComponentProps<"div"> {
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  handleBack: () => void;
}

function FGPForm({ handleSubmit, handleBack }: FGPProps) {
  const fields: FieldGroup[] = [
    {
      element: "input",
      name: "fgpUsername",
      placeholder: "Your FGP username",
      label: "Username",
      type: "text",
    },
    {
      element: "input",
      name: "fgpPassword",
      placeholder: "Your FGP password",
      label: "Password",
      type: "password",
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
        text: "Next",
        type: "submit",
        variant: "accent",
      },
    ],
  ];
  return (
    <Form
      variant="card"
      name="fgp"
      title="Five Guys People"
      description="Enter the details that you use to log into the Five Guys People app (shift app)"
      fields={fields}
      handleSubmit={handleSubmit}
      buttons={buttons}
      schema={fgpSchema}
      refreshes={false}
    />
  );
}

export default FGPForm;
