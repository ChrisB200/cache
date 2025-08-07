import useForm from "@/hooks/useForm";
import type { SignupFormValues } from "./types";
import SignupForm from "./SignupForm";
import { continueWithGoogle, signout, signup } from "@/services/authService";
import { useNavigate } from "react-router-dom";
import { getRedirect, makeURL } from "@/utils/url";
import CredentialsLayout from "@/layouts/CredentialsLayout";

function Signup() {
  const navigate = useNavigate();
  const redirect = getRedirect();
  const { values, setError } = useForm<SignupFormValues>("signup", {
    email: "",
    password: "",
  });

  const handleGoogle = async () => {
    await continueWithGoogle(redirect);
  };

  const handleSubmit = async () => {
    await signout();
    const response = await signup(values);

    console.log(response);

    if (response === "success") {
      return navigate(redirect);
    }

    console.log(response);
    switch (response.code) {
      case "email_not_confirmed":
        const url = makeURL({
          baseUrl: "/verify",
          queryParams: {
            email: values.email,
          },
        });
        navigate(url);
        break;
      default:
        setError(response);
    }
  };

  return (
    <CredentialsLayout>
      <SignupForm handleSubmit={handleSubmit} handleGoogle={handleGoogle} />
    </CredentialsLayout>
  );
}

export default Signup;
