import React, { useEffect, useState } from "react";
import BankCard from "./BankCard";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import type { BankAccount } from "@/types/banking";
import { motion } from "motion/react";
import { useCards } from "@/contexts/CardContext";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeBankPosition } from "@/services/bankingService";
import { useUser } from "@/contexts/UserContext";
import Link from "./Link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

function LoadingState() {
  return (
    <>
      <hr />
      <Skeleton className="w-full h-[260px] bg-primary-subtle" />
      <hr />
      <Skeleton className="w-full h-[260px] bg-primary-subtle" />
      <hr />
      <Skeleton className="w-full h-[260px] bg-primary-subtle" />
      <hr />
      <Skeleton className="w-full h-[260px] bg-primary-subtle" />
      <hr />
      <Skeleton className="w-full h-[260px] bg-primary-subtle" />
    </>
  );
}

function ErrorState() {
  return <p>error</p>;
}

function BankAccountSidebar({ }) {
  const { cards: queryCards, loading, error, needRelink } = useCards();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [cards, setCards] = React.useState<BankAccount[] | undefined>(
    undefined,
  );

  useEffect(() => {
    if (queryCards) {
      setCards(queryCards);
    }
  }, [queryCards]);

  const pointer = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5,
    },
  });

  const sensors = useSensors(pointer);

  const changePosition = useMutation({
    mutationFn: ({ id, new_position }: { id: string; new_position: number }) =>
      changeBankPosition(id, new_position),

    onMutate: async ({ id, new_position }) => {
      await queryClient.cancelQueries({
        queryKey: ["get", "bank_accounts", user?.id],
      });

      const prevCards = queryClient.getQueryData<BankAccount[]>([
        "get",
        "bank_accounts",
        user?.id,
      ]);
      if (!prevCards) return;

      const oldIndex = prevCards.findIndex((a) => a.id === id);
      if (oldIndex === -1) return { prevCards };

      const newCards = arrayMove(prevCards, oldIndex, new_position);

      queryClient.setQueryData(["get", "bank_accounts", user?.id], newCards);

      setCards(newCards);

      return { prevCards };
    },

    onError: (err, variables, context) => {
      if (context?.prevCards) {
        queryClient.setQueryData(
          ["get", "bank_accounts", user?.id],
          context.prevCards,
        );
        setCards(context.prevCards);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["get", "bank_accounts", user?.id],
      });
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active || !over || active.id === over.id || !cards) return;

    const oldIndex = cards.findIndex((c) => c.id === active.id);
    const newIndex = cards.findIndex((c) => c.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    changePosition.mutate({
      id: active.id as string,
      new_position: newIndex,
    });
  };

  return (
    <>
      <DndContext
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
        sensors={sensors}
      >
        <Sidebar className="bg-secondary w-[500px] p-4" side="right">
          {needRelink ? (
            <SidebarHeader>
              <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertTitle>Actions Required</AlertTitle>
                <AlertDescription>
                  <p>
                    Some accounts need to be relinked as they may have expired
                  </p>
                  <p>Please fix each account</p>
                </AlertDescription>
              </Alert>
            </SidebarHeader>
          ) : (
            ""
          )}
          <SidebarContent className="no-scrollbar">
            <SidebarGroup className="flex flex-col gap-8 mt-4">
              {loading ? (
                <LoadingState />
              ) : error || !cards ? (
                <ErrorState />
              ) : (
                <SortableContext
                  items={cards.map((card) => card.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {cards.map((bankAccount, i) => (
                    <React.Fragment key={bankAccount.id}>
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="flex flex-col gap-6"
                      >
                        <BankCard bankAccount={bankAccount} />
                        {i < cards.length - 1 && <hr className="h-1" />}
                      </motion.div>
                    </React.Fragment>
                  ))}
                </SortableContext>
              )}
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <Link />
          </SidebarFooter>
        </Sidebar>
      </DndContext>
    </>
  );
}

export default BankAccountSidebar;
