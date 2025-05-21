import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

export const fetchItems = createAsyncThunk('items/fetchItems', async (userId) => {
  const querySnapshot = await getDocs(collection(db, 'users', userId, 'items'));
  const items = [];
  querySnapshot.forEach((doc) => {
    items.push({ id: doc.id, ...doc.data() });
  });
  return items;
});

export const addItem = createAsyncThunk('items/addItem', async ({ userId, name, cost }) => {
  const createdAt = new Date().toISOString();
  const docRef = await addDoc(collection(db, 'users', userId, 'items'), { name, cost, createdAt });
  return { id: docRef.id, name, cost, createdAt };
});

export const updateItem = createAsyncThunk('items/updateItem', async ({ userId, itemId, name, cost }) => {
  await updateDoc(doc(db, 'users', userId, 'items', itemId), { name, cost });
  return { id: itemId, name, cost };
});

export const deleteItem = createAsyncThunk('items/deleteItem', async ({ userId, itemId }) => {
  await deleteDoc(doc(db, 'users', userId, 'items', itemId));
  return itemId;
});

const itemsSlice = createSlice({
  name: 'items',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          // Preserve createdAt if present
          state.items[index] = { ...state.items[index], ...action.payload };
        }
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export default itemsSlice.reducer;