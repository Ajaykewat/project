import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface MonthlyGoal {
  _id: string;
  amount: number;
  month: string;
  year: number;
  achieved: boolean;
}

interface MonthlyGoalState {
  currentGoal: MonthlyGoal | null;
  allGoals: MonthlyGoal[];
  loading: boolean;
  error: string | null;
}

const initialState: MonthlyGoalState = {
  currentGoal: null,
  allGoals: [],
  loading: false,
  error: null
};

export const createMonthlyGoal = createAsyncThunk(
  'monthlyGoal/create',
  async (goalData: { amount: number; month: string; year: number }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/monthly-goals', goalData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create goal');
    }
  }
);

export const getCurrentMonthGoal = createAsyncThunk(
  'monthlyGoal/getCurrent',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/monthly-goals/current', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch current goal');
    }
  }
);

export const getAllGoals = createAsyncThunk(
  'monthlyGoal/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/monthly-goals', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch goals');
    }
  }
);

export const updateMonthlyGoal = createAsyncThunk(
  'monthlyGoal/update',
  async ({ id, amount }: { id: string; amount: number }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:5000/api/monthly-goals/${id}`, 
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update goal');
    }
  }
);

const monthlyGoalSlice = createSlice({
  name: 'monthlyGoal',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createMonthlyGoal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMonthlyGoal.fulfilled, (state, action) => {
        state.loading = false;
        state.currentGoal = action.payload;
        state.allGoals.push(action.payload);
      })
      .addCase(createMonthlyGoal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getCurrentMonthGoal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentMonthGoal.fulfilled, (state, action) => {
        state.loading = false;
        state.currentGoal = action.payload;
      })
      .addCase(getCurrentMonthGoal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getAllGoals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllGoals.fulfilled, (state, action) => {
        state.loading = false;
        state.allGoals = action.payload;
      })
      .addCase(getAllGoals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateMonthlyGoal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMonthlyGoal.fulfilled, (state, action) => {
        state.loading = false;
        state.currentGoal = action.payload;
        state.allGoals = state.allGoals.map(goal =>
          goal._id === action.payload._id ? action.payload : goal
        );
      })
      .addCase(updateMonthlyGoal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export default monthlyGoalSlice.reducer;