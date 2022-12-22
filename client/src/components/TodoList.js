import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import Loading from "./Loading";
import Error from "./Error";

import { selectFilteredTodos } from "../redux/todos/todosSlice";

import {
  fetchTodos,
  toggleTodoAsync,
  deleteTodoAsync,
} from "../redux/todos/services";

export default function TodoList() {
  const dispatch = useDispatch();

  const filteredTodos = useSelector(selectFilteredTodos);

  const isLoading = useSelector((state) => state.todos.isLoading);
  const error = useSelector((state) => state.todos.error);

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deleteTodoAsync(id));
    }
  };
  const handleToggle = async (id, completed) => {
    await dispatch(toggleTodoAsync({ id, data: { completed } }));
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} />;
  }

  return (
    <ul className="todo-list">
      {filteredTodos.map((item) => (
        <li key={item.id} className={item.completed ? "completed" : ""}>
          <div className="view">
            <input
              className="toggle"
              type="checkbox"
              onChange={() => handleToggle(item.id, !item.completed)}
              checked={item.completed}
            />
            <label>{item.title}</label>
            <button
              className="destroy"
              onClick={() => handleDelete(item.id)}
            ></button>
          </div>
        </li>
      ))}
    </ul>
  );
}
