import CredentialsLayout from "@/layouts/CredentialsLayout";
import CompleteSignupForm from "./CompleteSignupForm";
import { completeSignup } from "@/services/authService";
import useForm from "@/hooks/useForm";
import { useNavigate } from "react-router-dom";
import { getRedirect } from "@/utils/url";
import { useUser } from "@/contexts/UserContext";
import { useEffect } from "react";

function CompleteSignup() {
  const navigate = useNavigate();
  const redirect = getRedirect();
  const { user } = useUser();
  const { values, setError } = useForm("complete-signup", {
    username: "",
    nickname: "",
  });

  useEffect(() => {
    if (!user) navigate(redirect);

    if (user?.username || user?.nickname) navigate(redirect);
  }, []);

  const handleSubmit = async () => {
    const response = await completeSignup(values);
    if (response === "success") {
      navigate(redirect);
      window.location.reload();
      return;
    }

    setError(response);
  };

  return (
    <CredentialsLayout>
      <CompleteSignupForm handleSubmit={handleSubmit} />
    </CredentialsLayout>
  );
}

export default CompleteSignup;
