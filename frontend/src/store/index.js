import { configureStore } from '@reduxjs/toolkit';
import interactionReducer from './interactionSlice';

export const store = configureStore({
  reducer: {
    interaction: interactionReducer,
  },
});

export default store;