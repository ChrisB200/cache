import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

function ForgotPasswordCard() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/login");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Check Your Email</CardTitle>
        <CardDescription>
          An email will have been sent containing a link to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" onClick={handleClick}>
          Go Back to Login
        </Button>
      </CardContent>
    </Card>
  );
}

export default ForgotPasswordCard;
