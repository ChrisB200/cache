import CredentialsLayout from "@/layouts/CredentialsLayout";
import ResetPasswordForm from "./ResetPasswordForm";
import useForm from "@/hooks/useForm";
import { resetPassword } from "@/services/authService";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
  const navigate = useNavigate();

  const { values, setError } = useForm("reset-password", {
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async () => {
    const response = await resetPassword(values.password);
    if (response === "success") {
      navigate("/");
      return;
    }

    setError(response);
  };

  return (
    <CredentialsLayout>
      <ResetPasswordForm handleSubmit={handleSubmit} />
    </CredentialsLayout>
  );
}

export default ResetPassword;
