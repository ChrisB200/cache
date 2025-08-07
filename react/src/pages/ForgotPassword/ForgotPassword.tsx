import CredentialsLayout from "@/layouts/CredentialsLayout";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "@/services/authService";
import useForm from "@/hooks/useForm";
import { useState } from "react";
import ForgotPasswordCard from "./ForgotCard";

function ForgotPassword() {
  const navigate = useNavigate();
  const [hasSent, setHasSent] = useState(false);

  const { values, setError } = useForm("forgot-password", {
    email: "",
  });

  const handleSubmit = async () => {
    const response = await forgotPassword(values.email);
    if (response === "success") {
      setHasSent(true);
      return;
    }

    setError(response);
  };

  const handleBack = () => {
    navigate("/login");
  };

  return (
    <CredentialsLayout>
      {!hasSent ? (
        <ForgotPasswordForm
          handleSubmit={handleSubmit}
          handleBack={handleBack}
        />
      ) : (
        <ForgotPasswordCard />
      )}
    </CredentialsLayout>
  );
}

export default ForgotPassword;
