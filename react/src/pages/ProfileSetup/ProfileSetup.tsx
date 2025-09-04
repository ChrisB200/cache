import CredentialsLayout from "@/layouts/CredentialsLayout";
import StoreForm from "./StoreForm";
import { useState } from "react";
import { setTime } from "@/utils/datetime";
import useForm from "@/hooks/useForm";
import FGPForm from "./FGPForm";
import SDWorxForm from "./SDWorxForm";
import type {
  FGPFormValues,
  StoreFormValues,
  SDFormValues,
  AccountProfile,
} from "./types";
import { useNavigate } from "react-router-dom";
import { setupFiveGuys } from "@/services/userService";

function ProfileSetup() {
  const [step, setStep] = useState<number>(0);
  const navigate = useNavigate();
  const { values: storeForm } = useForm<StoreFormValues>("store", {
    workplace: "FIVEGUYS",
    rate: 12.05,
    open: setTime({ hours: 10 }),
    close: setTime({ hours: 23 }),
  });

  const { values: fgpForm } = useForm<FGPFormValues>("fgp", {
    fgp_username: "",
    fgp_password: "",
  });

  const { values: sdForm, setError } = useForm<SDFormValues>("sdworx", {
    sd_username: "",
    sd_password: "",
  });

  const handleNext = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStep((prev) => prev + 1);
  };

  const handleBack = async () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    const combined: AccountProfile = { ...storeForm, ...fgpForm, ...sdForm };
    const response = await setupFiveGuys(combined);

    if (response === "success") return navigate("/");

    setError(response);
  };

  const forms = [
    <StoreForm handleSubmit={handleNext} />,
    <FGPForm handleSubmit={handleNext} handleBack={handleBack} />,
    <SDWorxForm handleSubmit={handleSubmit} handleBack={handleBack} />,
  ];

  return (
    <>
      <CredentialsLayout>{forms[step]}</CredentialsLayout>
    </>
  );
}

export default ProfileSetup;
