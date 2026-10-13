import { createStore } from "redux";

const initialState = {
  search: null,
  selectedFlight: null,
  passenger: null,
  confirmationCode: null,
};

const bookingReducer = (state = initialState, action) => {
  switch (action.type) {
    case "RESET_BOOKING":
      return initialState;
    case "SEARCH_FLIGHTS":
      return {
        ...state,
        search: action.search,
        selectedFlight: null,
        passenger: null,
        confirmationCode: null,
      };
    case "SELECT_FLIGHT":
      return {
        ...state,
        selectedFlight: action.flight,
        passenger: null,
        confirmationCode: null,
      };
    case "CONFIRM_BOOKING":
      return {
        ...state,
        passenger: action.passenger,
        confirmationCode: action.confirmationCode,
      };
    default:
      return state;
  }
};

const store = createStore(bookingReducer);

export default store;
