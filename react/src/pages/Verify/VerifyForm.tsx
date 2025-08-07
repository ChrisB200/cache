import Form from "@/components/ui/form/Form";
import type { ButtonGroup, FieldGroup } from "@/types/form";
import { z } from "zod";

const verifySchema = z.object({
  code: z.string().min(6, "Code must be 6 characters"),
});

interface VerifyFormProps {
  handleSubmit: () => void;
  handleBack: () => void;
}

function VerifyForm({ handleSubmit, handleBack }: VerifyFormProps) {
  const fields: FieldGroup[] = [
    {
      element: "input-otp",
      maxLength: 6,
      name: "code",
      label: "",
    },
  ];

  const buttons: ButtonGroup[] = [
    [
      {
        text: "Back",
        type: "button",
        onClick: handleBack,
        variant: "outline",
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
      name="verify"
      title="Verify Account"
      description="A 6 digit code has been sent to your email"
      fields={fields}
      buttons={buttons}
      schema={verifySchema}
      handleSubmit={handleSubmit}
    />
  );
}

export default VerifyForm;
