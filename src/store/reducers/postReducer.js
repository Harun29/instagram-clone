import { createSlice } from "@reduxjs/toolkit";

export const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [
      {id: '0', header: 'help me find peach', description: 'i have no idea where i lost it'},
      {id: '1', header: 'help me find banana', description: 'i have no idea where i lost it'},
      {id: '3', header: 'help me find apple', description: 'i have no idea where i lost it'}
    ]
  }
});

export default postSlice.reducer;