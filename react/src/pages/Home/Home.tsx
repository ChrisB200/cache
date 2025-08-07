import { useUser } from "@/contexts/UserContext";
import React from "react";

function Home() {
  const { user } = useUser();

  return <div>Home</div>;
}

export default Home;
