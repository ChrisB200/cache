import type { GetShifts, Shift } from "@/types/shifts";
import request from "@/utils/request";
import { makeURL } from "@/utils/url";

const getShiftsRequest = async (query: GetShifts) => {
  const url = makeURL({ baseUrl: "shifts/", queryParams: { ...query } });
  return request<Shift[]>("get", url);
};

export { getShiftsRequest };
