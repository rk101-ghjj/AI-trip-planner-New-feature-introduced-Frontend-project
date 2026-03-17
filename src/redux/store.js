import { configureStore } from "@reduxjs/toolkit";
import tripReducer from "./tripSlice.js";

export default configureStore({
  reducer: {
    trip: tripReducer,
  },
});