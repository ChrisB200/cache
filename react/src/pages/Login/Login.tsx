import CredentialsLayout from "@/layouts/CredentialsLayout";
import LoginForm from "./LoginForm";
import useForm from "@/hooks/useForm";
import { useNavigate } from "react-router-dom";
import { getRedirect, makeURL } from "@/utils/url";
import { continueWithGoogle, login, resendCode } from "@/services/authService";

function Login() {
  const navigate = useNavigate();
  const redirect = getRedirect();
  const { values, setError } = useForm("login", {
    email: "",
    password: "",
  });

  const handleSubmit = async () => {
    const response = await login(values);

    if (response === "success") {
      navigate(redirect);
      window.location.reload();
      return;
    }

    switch (response.code) {
      case "email_not_confirmed":
        await resendCode(values.email);
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

  const handleGoogle = async () => {
    await continueWithGoogle(redirect);
  };

  return (
    <CredentialsLayout>
      <LoginForm handleSubmit={handleSubmit} handleGoogle={handleGoogle} />
    </CredentialsLayout>
  );
}

export default Login;
