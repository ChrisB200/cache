import { getRedirect } from "@/utils/url";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AuthCallback() {
  const redirect = getRedirect();
  const navigate = useNavigate();

  const handleCallback = async () => {
    navigate(redirect);
  };

  useEffect(() => {
    handleCallback();
  }, []);

  return <div>Loading</div>;
}

export default AuthCallback;
