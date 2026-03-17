import { createSlice } from "@reduxjs/toolkit";

const tripSlice = createSlice({
  name: "trip",
  initialState: {
    searchQuery: "",
    lastDestination: "",
    from: "",
    to: "",
    date: "",
    budget: "",
    days: "",
    companions: "",
    plan: null,
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setLastDestination: (state, action) => {
      state.lastDestination = action.payload;
    },
    setTrip: (state, action) => {
      return { ...state, ...action.payload };
    },
    setPlan: (state, action) => {
      state.plan = action.payload;
    },
  },
});

export const { setSearchQuery, setLastDestination, setTrip, setPlan } = tripSlice.actions;
export default tripSlice.reducer;