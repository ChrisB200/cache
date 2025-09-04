import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function Work() {
  return (
    <div>
      <Button asChild>
        <Link to="/profile/setup">Setup account details</Link>
      </Button>
    </div>
  );
}

export default Work;
