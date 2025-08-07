import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import Form from "@/components/ui/form/Form";
import loginSchema from "./LoginSchema";
import type { FieldGroup, ButtonGroup } from "@/types/form";

interface LoginProps extends React.ComponentProps<"div"> {
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  handleGoogle: () => void;
}

export function LoginForm({
  handleSubmit,
  handleGoogle,
  className,
  ...rest
}: LoginProps) {
  const fields: FieldGroup[] = [
    {
      element: "input",
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "m@example.com",
      required: true,
    },
    {
      element: "input",
      name: "password",
      label: "Password",
      type: "password",
      required: true,
      trailingContent: (
        <Link
          to="/forgot-password"
          className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
        >
          Forgot your password?
        </Link>
      ),
    },
  ];

  const buttons: ButtonGroup[] = [
    {
      text: "Log In",
      type: "submit",
      variant: "accent",
    },
  ];

  return (
    <Form
      variant="card"
      name="login"
      title="Login to your account"
      description="Enter your email below to login to your account"
      fields={fields}
      buttons={buttons}
      schema={loginSchema}
      handleSubmit={handleSubmit}
      secondaryButton={{
        text: "Continue with Google",
        onClick: handleGoogle,
        variant: "outline",
      }}
      showSeparator
      bottomText={
        <>
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="underline underline-offset-4">
            Sign up
          </Link>
        </>
      }
      className={className}
      {...rest}
    />
  );
}

export default LoginForm;
