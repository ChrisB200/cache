import type { FormEvent } from "react";
import type { ButtonGroup, FieldGroup } from "@/types/form";
import Form from "@/components/ui/form/Form";
import storeSchema from "./StoreSchema";

interface StoreProps extends React.ComponentProps<"div"> {
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export function StoreForm({ handleSubmit }: StoreProps) {
  const fields: FieldGroup[] = [
    {
      element: "select",
      name: "workplace",
      placeholder: "Your workplace",
      required: true,
      label: "Select your workplace",
      options: [{ label: "Five Guys", value: "FIVEGUYS" }],
    },
    [
      {
        element: "input",
        name: "open",
        required: true,
        label: "Opening Time",
        type: "time",
      },
      {
        element: "input",
        name: "close",
        required: true,
        label: "Closing Time",
        type: "time",
      },
    ],
  ];
  const buttons: ButtonGroup[] = [
    {
      text: "Next",
      type: "submit",
      variant: "accent",
    },
  ];

  return (
    <Form
      variant="card"
      name="store"
      title="Store Details"
      description="So we can accurately track shifts"
      fields={fields}
      handleSubmit={handleSubmit}
      schema={storeSchema}
      buttons={buttons}
      refreshes={false}
    />
  );
}

export default StoreForm;
