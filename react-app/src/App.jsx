import { Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUpPage";
import Login from "./pages/LoginPage";
import Home from "./pages/HomePage";
import Work from "./pages/WorkPage";
import ProtectedRoutes from "./utils/protectedRoutes"
import { FontProvider } from "./contexts/FontContext";

function App() {
  return (
    <FontProvider>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoutes />}>
          <Route path="/home" element={<Home />} />
          <Route path="/work" element={<Work />}/>
        </Route>
      </Routes>
    </FontProvider>
  );
}

export default App;
