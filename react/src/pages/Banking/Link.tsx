import React, { useState, useCallback, useEffect } from "react";
import {
  createLinkToken,
  exchangePublicToken,
  // updateMode,
} from "@/services/bankingService";
import { usePlaidLink } from "react-plaid-link";
import { Button } from "@/components/ui/button";
import { ClipLoader } from "react-spinners";
import { useLink } from "@/contexts/LinkContext";
import { useCards } from "@/contexts/CardContext";

const Link = () => {
  const {
    loading,
    setLoading,
    error,
    isUpdateMode,
    setError,
    setLinkToken,
    linkToken,
    generateToken,
  } = useLink();
  const { refetch } = useCards();

  const onSuccess = useCallback(async (public_token: string, metadata: any) => {
    setLoading(true);
    setError(null);
    const test = localStorage.getItem("update-mode");
    try {
      if (test === "1") {
        const account_id = metadata.account_id;
        //const response = await updateMode(account_id);
        //if (response !== "success") {
        //  throw new Error(response?.error || "Unexpected server response");
        // }
      } else {
        const response = await exchangePublicToken(public_token);
        // Example: if your service returns { status: "success" } or similar
        if (response !== "success") {
          throw new Error(response?.error || "Unexpected server response");
        }
      }
      // Handle success (e.g., navigate, show message)
      refetch();
      setLoading(false);
    } catch (err: any) {
      console.error("Token exchange failed:", err);
      setError(err.message || "Error exchanging token");
    }
  }, []);

  const onExit = (err: any, metadata: any) => {
    if (err) {
      console.warn("Plaid Link exited with error:", err);
      setError(err.error_message);
    }

    setLinkToken(null);
    setLoading(false);
    localStorage.removeItem("update-mode");
  };

  const { open, ready } = usePlaidLink({
    token: linkToken || "",
    onSuccess,
    onExit,
  });

  useEffect(() => {
    if (ready && open) open();
  }, [ready, open]);

  return loading ? (
    <Button disabled={true}>
      <ClipLoader color="#76d27e" size={12} />
    </Button>
  ) : (
    <Button onClick={() => generateToken()}>Link Account</Button>
  );
};

export default Link;
