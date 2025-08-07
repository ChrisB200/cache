import { createLinkToken } from "@/services/bankingService";
import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

interface LinkContextValues {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
  linkToken: string | null;
  setLinkToken: Dispatch<SetStateAction<string | null>>;
  generateToken: (accessToken?: string) => void;
  isUpdateMode: boolean;
}

export const LinkContext = createContext<LinkContextValues | null>(null);

export const LinkProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [isUpdateMode, setIsUpdateMode] = useState<boolean>(false);

  const generateToken = async (accessToken?: string) => {
    setLoading(true);

    if (accessToken) {
      console.log("hey");
      localStorage.setItem("update-mode", "1");
      setIsUpdateMode(true);
    } else {
      localStorage.setItem("update-mode", "0");
      setIsUpdateMode(false);
    }

    try {
      const response = await createLinkToken();
      if (typeof response === "string") {
        setLinkToken(response);
        setLoading(false);
      } else {
        throw new Error("Unexpected response from createLinkToken");
      }
    } catch (err: any) {
      console.error("Failed to generate link token:", err);
      setLoading(false);
    }
  };

  return (
    <LinkContext.Provider
      value={{
        loading,
        setLoading,
        error,
        setError,
        linkToken,
        setLinkToken,
        generateToken,
        isUpdateMode,
      }}
    >
      {children}
    </LinkContext.Provider>
  );
};

export const useLink = () => {
  const context = useContext(LinkContext);
  if (!context) {
    throw new Error("useLink must be used within a LinkProvider");
  }
  return context;
};
