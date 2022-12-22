import { createSlice } from "@reduxjs/toolkit";
import {
  addTodoAsync,
  deleteTodoAsync,
  toggleTodoAsync,
  fetchTodos,
} from "./services";

export const todosSlice = createSlice({
  name: "todos",
  initialState: {
    items: [],
    isLoading: false,
    error: null,
    activeFilter: localStorage.getItem("activeFilter"),
    addNewTodo: {
      isLoading: false,
      error: false,
    },
  },
  reducers: {
    //without the server
    // addTodo: {
    //   reducer: (state, action) => {
    //     state.items.push(action.payload);
    //   },
    //   prepare: ({ title }) => {
    //     return {
    //       payload: {
    //         id: nanoid(5),
    //         title,
    //         completed: false,
    //       },
    //     };
    //   },
    // },

    // toggle: (state, action) => {
    //   const { id } = action.payload;
    //   const item = state.items.find((item) => item.id === id);

    //   item.completed = !item.completed;
    // },
    // deleteTodo: (state, action) => {
    //   const id = action.payload;
    //   const filteredTodos = state.items.filter((item) => item.id !== id);
    //   state.items = filteredTodos;
    // },
    changeActiveFilter: (state, action) => {
      state.activeFilter = action.payload;
    },
    clearCompleted: (state) => {
      const filterCompleted = state.items.filter((item) => !item.completed);
      state.items = filterCompleted;
    },
  },
  extraReducers: {
    [fetchTodos.pending]: (state, action) => {
      state.isLoading = true;
    },
    [fetchTodos.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.items = action.payload;
    },
    [fetchTodos.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    },
    [addTodoAsync.fulfilled]: (state, action) => {
      state.items.push(action.payload);
      state.addNewTodo.isLoading = false;
    },
    [addTodoAsync.pending]: (state, action) => {
      state.addNewTodo.isLoading = true;
    },
    [addTodoAsync.rejected]: (state, action) => {
      state.addNewTodo.error = action.error.message;
      state.addNewTodo.isLoading = false;
    },
    [toggleTodoAsync.fulfilled]: (state, action) => {
      const { id, completed } = action.payload;
      const index = state.items.findIndex((item) => item.id === id);
      state.items[index].completed = completed;
    },
    [deleteTodoAsync.fulfilled]: (state, action) => {
      const id = action.payload;
      const index = state.items.findIndex((item) => item.id === id);
      //remove the one coming after the indexed item-which is itself
      state.items.splice(index, 1);
    },
  },
});

export const selectTodos = (state) => state.todos.items;

export const selectFilteredTodos = (state) => {
  const { items, activeFilter } = state.todos;

  if (activeFilter === "all") {
    return items;
  }

  return items.filter((item) =>
    activeFilter === "active" ? !item.completed : item.completed
  );
};

export const { toggle, deleteTodo, changeActiveFilter, clearCompleted } =
  todosSlice.actions;
export default todosSlice.reducer;
