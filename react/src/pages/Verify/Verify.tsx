import CredentialsLayout from "@/layouts/CredentialsLayout";
import VerifyForm from "./VerifyForm";
import { useNavigate } from "react-router-dom";
import useForm from "@/hooks/useForm";
import { confirmCode } from "@/services/authService";
import { getQueryParam, getRedirect, makeURL } from "@/utils/url";
import { useUser } from "@/contexts/UserContext";

function Verify() {
  const navigate = useNavigate();
  const redirect = getRedirect();
  const { decoded: email } = getQueryParam("email");
  const { getUser } = useUser();

  if (!email) {
    const url = makeURL({
      baseUrl: "/login",
      queryParams: {
        redirect,
      },
    });
    navigate(url);
  }

  const { values, setError } = useForm("verify", {
    code: "",
  });

  const handleSubmit = async () => {
    const response = await confirmCode(email, values.code, "email");

    if (response === "success") {
      getUser();
      navigate(redirect);
      window.location.reload();
      return;
    }

    switch (response.code) {
      case "otp_expired":
        setError({
          title: "Login Expired",
          description: "Please log in again to verify your account",
          buttons: [
            {
              variant: "default",
              onClick: handleBack,
              text: "Back to Login",
            },
          ],
        });
        break;
      default:
        setError({
          ...response,
          buttons: [
            {
              variant: "default",
              text: "Try again",
            },
          ],
        });
        break;
    }
  };

  const handleBack = () => {
    navigate("/login");
  };

  return (
    <CredentialsLayout>
      <VerifyForm handleSubmit={handleSubmit} handleBack={handleBack} />
    </CredentialsLayout>
  );
}

export default Verify;
