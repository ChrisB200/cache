import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { FormStoreProvider } from "./contexts/FormStoreContext";
import Home from "./pages/Home/Home";
import Signup from "./pages/Signup/Signup";
import Verify from "./pages/Verify/Verify";
import Login from "./pages/Login/Login";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import NotFound from "./pages/NotFound/NotFound";
import CompleteSignup from "./pages/CompleteSignup/CompleteSignup";
import { UserProvider } from "./contexts/UserContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthCallback from "./pages/AuthCallback/AuthCallback";
import ProfileSetup from "./pages/ProfileSetup/ProfileSetup";
import Banking from "./pages/Banking/Banking";
import { LinkProvider } from "./contexts/LinkContext";
import Work from "./pages/Work/Work";

function App() {
  return (
    <UserProvider>
      <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
        <FormStoreProvider>
          <LinkProvider>
            <Routes>
              <Route path="/signup" element={<Signup />} />
              <Route path="/verify" element={<Verify />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Home />} />
                <Route path="/onboarding" element={<CompleteSignup />} />
                <Route path="/profile/setup" element={<ProfileSetup />} />
                <Route path="/banking" element={<Banking />} />
                <Route path="/work" element={<Work />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </LinkProvider>
        </FormStoreProvider>
      </ThemeProvider>
    </UserProvider>
  );
}

export default App;
