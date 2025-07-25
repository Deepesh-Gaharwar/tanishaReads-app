import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    token: null,
    admin: null,
  },
  reducers: {
    addUser: (state, action) => {
      state.token = action.payload.token;
      state.admin = action.payload.admin;
    },
    removeUser: (state) => {
      state.token = null;
      state.admin = null;
    },
  },
});

export const { addUser, removeUser } = userSlice.actions;

export default userSlice.reducer;
