import { sortShifts } from "../utils/shift";

const shiftReducer = (state, action) => {
  switch (action.type) {
    case "SET_SHIFTS":
      return sortShifts(action.payload);
  }
}

export default shiftReducer;
