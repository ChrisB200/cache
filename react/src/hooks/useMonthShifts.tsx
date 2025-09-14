import { useQueries, useQuery } from "@tanstack/react-query";
import type { Shift } from "@/types/shifts";
import { getShiftsByMonth } from "@/services/shiftService";

interface useMonthShiftsProps {
  date: Date;
  options?: {
    enabled?: boolean;
    staleTime?: number;
  };
}

function useMonthShifts({ date, options }: useMonthShiftsProps) {
  const prev = new Date(date.getTime());
  prev.setMonth(date.getMonth() - 1);

  const next = new Date(date.getTime());
  next.setMonth(date.getMonth() + 1);

  const datesToFetch = [prev, date, next];

  const queries = useQueries<Shift[]>({
    queries: datesToFetch.map((d) => ({
      queryKey: ["shifts", d.getFullYear(), d.getMonth()],
      queryFn: () => getShiftsByMonth(d.getFullYear(), d.getMonth()),
      ...options,
    })),
  });

  const shifts = queries
    .filter((q) => q.data != null)
    .flatMap((q) => q.data as Shift[]);

  const isLoading = queries.some((q) => q.isLoading);
  const isError = queries.some((q) => q.isError);

  return { shifts, isLoading, isError, queries };
}

export default useMonthShifts;
