import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

export const fetchOtherCosts = createAsyncThunk('otherCosts/fetchOtherCosts', async (userId) => {
  const querySnapshot = await getDocs(collection(db, 'users', userId, 'otherCosts'));
  const otherCosts = [];
  querySnapshot.forEach((doc) => {
    otherCosts.push({ id: doc.id, ...doc.data() });
  });
  return otherCosts;
});

export const addOtherCost = createAsyncThunk('otherCosts/addOtherCost', async ({ userId, description, amount }) => {
  const createdAt = new Date().toISOString();
  const docRef = await addDoc(collection(db, 'users', userId, 'otherCosts'), { description, amount, createdAt });
  return { id: docRef.id, description, amount, createdAt };
});

export const updateOtherCost = createAsyncThunk('otherCosts/updateOtherCost', async ({ userId, costId, description, amount }) => {
  await updateDoc(doc(db, 'users', userId, 'otherCosts', costId), { description, amount });
  return { id: costId, description, amount };
});

export const deleteOtherCost = createAsyncThunk('otherCosts/deleteOtherCost', async ({ userId, costId }) => {
  await deleteDoc(doc(db, 'users', userId, 'otherCosts', costId));
  return costId;
});

const otherCostsSlice = createSlice({
  name: 'otherCosts',
  initialState: { otherCosts: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOtherCosts.fulfilled, (state, action) => {
        state.otherCosts = action.payload;
        state.status = 'succeeded';
      })
      .addCase(addOtherCost.fulfilled, (state, action) => {
        state.otherCosts.push(action.payload);
      })
      .addCase(updateOtherCost.fulfilled, (state, action) => {
        const index = state.otherCosts.findIndex((cost) => cost.id === action.payload.id);
        if (index !== -1) {
          // Preserve createdAt if present
          state.otherCosts[index] = { ...state.otherCosts[index], ...action.payload };
        }
      })
      .addCase(deleteOtherCost.fulfilled, (state, action) => {
        state.otherCosts = state.otherCosts.filter((cost) => cost.id !== action.payload);
      });
  },
});

export default otherCostsSlice.reducer;