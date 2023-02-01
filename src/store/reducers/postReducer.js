import { createSlice } from "@reduxjs/toolkit";

export const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [
      {id: '0', header: 'help me find peach', description: 'i have no idea where i lost it'},
      {id: '1', header: 'help me find banana', description: 'i have no idea where i lost it'},
      {id: '3', header: 'help me find apple', description: 'i have no idea where i lost it'},
      {id: '4', header: 'help me find apple', description: 'i have no idea where i lost it'}
    ]
  },
  reducers: {
    addPost: (state, action) => {
      state.posts = [...state.posts, action.payload];
      console.log("action payload", action.payload);
      console.log("state posts", state.posts);
    }
  },
  extraReducers: {
    [addPostAsync.fulfilled]: (state, action) => {
      state.posts = [...state.posts, action.payload];
    }
  }

});

export const addPostAsync = post => async (dispatch, getState, { getFirebase, getFirestore }) => {
  const firestore = getFirestore();
  const newPost = {
    header: post.header,
    description: post.description,
    createdAt: new Date()
  };
  try {
    await firestore.collection("posts").add(newPost);
    dispatch(addPost(newPost));
  } catch (error) {
    console.log(error);
  }
};

export const { addPost } = postSlice.actions

export default postSlice.reducer;