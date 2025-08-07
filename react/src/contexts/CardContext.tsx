import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { BankAccount } from "@/types/banking";
import { getBankCards } from "@/services/bankingService";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "./UserContext";
import type { UseQueryResult } from "@tanstack/react-query";

type RefetchFn = (options?: {
  throwOnError?: boolean;
  cancelRefetch?: boolean;
}) => Promise<UseQueryResult<BankAccount[] | undefined, Error>>;

interface CardContextValues {
  cards?: BankAccount[];
  loading: boolean;
  error: Error | null;
  refetch: RefetchFn;
  selectedCardsIds: string[];
  selectedCards: BankAccount[];
  selectCard: (id: string) => void;
  removeCard: (id: string) => void;
  removeAllCards: () => void;
  toggleSelectedCard: (id: string) => void;
  needRelink: boolean;
}

// Create context with default value null
export const CardContext = createContext<CardContextValues | null>(null);

// Define props for the provider
interface CardProviderProps {
  children: ReactNode;
}

export const CardsProvider = ({ children }: CardProviderProps) => {
  const { user } = useUser();
  const [selectedCardsIds, setSelectedCardsIds] = useState<string[]>([]);
  const [selectedCards, setSelectedCards] = useState<BankAccount[]>([]);
  const [needRelink, setNeedRelink] = useState<boolean>(false);
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["get", "bank_accounts", user?.id],
    queryFn: getBankCards,
  });

  const selectCard = (id: string) => {
    if (!data) return;
    setSelectedCardsIds((prev) => [...prev, id]);
  };

  const removeCard = (id: string) => {
    if (!data) return;
    setSelectedCardsIds((prev) => prev.filter((card) => card !== id));
  };

  const removeAllCards = () => {
    setSelectedCardsIds([]);
  };

  const toggleSelectedCard = (id: string) => {
    if (selectedCardsIds.indexOf(id) === -1) {
      selectCard(id);
    } else {
      removeCard(id);
    }
  };

  useEffect(() => {
    if (!data) return;

    const expired = data.find((i) => i.expired);
    if (expired) {
      setNeedRelink(true);
    } else {
      setNeedRelink(false);
    }
  }, [data]);

  useEffect(() => {
    if (!data) return;

    const tmp = data.filter((card) => {
      return selectedCardsIds.filter((id) => card.id === id);
    });

    setSelectedCards(tmp);
  }, [selectedCardsIds, data]);

  return (
    <CardContext.Provider
      value={{
        cards: data,
        loading: isLoading,
        error,
        refetch,
        selectedCardsIds,
        selectedCards,
        selectCard,
        removeCard,
        removeAllCards,
        toggleSelectedCard,
        needRelink,
      }}
    >
      {children}
    </CardContext.Provider>
  );
};

export const useCards = (): CardContextValues => {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error("useCards must be used within a CardProvider");
  }
  return context;
};
