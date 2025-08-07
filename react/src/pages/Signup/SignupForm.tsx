import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import Form from "@/components/ui/form/Form";
import type { FieldGroup, ButtonGroup } from "@/types/form";
import signupSchema from "./SignupSchema";

interface SignupFormProps extends React.ComponentProps<"div"> {
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  handleGoogle: () => void;
}

export function SignupForm({
  handleSubmit,
  handleGoogle,
  className,
  ...rest
}: SignupFormProps) {
  const fields: FieldGroup[] = [
    {
      element: "input",
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "m@example.com",
      required: true,
    },
    [
      {
        element: "input",
        name: "password",
        label: "Password",
        type: "password",
        required: true,
      },
      {
        element: "input",
        name: "confirmPassword",
        label: "Confirm Password",
        type: "password",
        required: true,
      },
    ],
  ];

  const buttons: ButtonGroup[] = [
    {
      text: "Create Account",
      type: "submit",
      variant: "accent",
    },
  ];

  return (
    <Form
      variant="card"
      name="signup"
      title="Create an account"
      description="Enter your email below to create an account"
      fields={fields}
      buttons={buttons}
      handleSubmit={handleSubmit}
      secondaryButton={{
        text: "Continue with Google",
        onClick: handleGoogle,
        variant: "outline",
      }}
      showSeparator
      schema={signupSchema}
      bottomText={
        <>
          Already have an account?{" "}
          <Link to="/login" className="underline underline-offset-4">
            Log In
          </Link>
        </>
      }
      className={className}
      {...rest}
    />
  );
}

export default SignupForm;
