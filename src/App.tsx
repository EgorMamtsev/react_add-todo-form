import './App.scss';
import { TodoList } from './components/TodoList';

import usersFromServer from './api/users';
import todosFromServer from './api/todos';
import React, { useState } from 'react';

export const App = () => {
  const [title, setTitle] = useState('');
  const [userId, setUserId] = useState(0);

  const [todos, setTodos] = useState(todosFromServer);
  const [users] = useState(usersFromServer); //setUsers

  const [hasTitleError, setHasTitleError] = useState(false);
  const [hasUserError, setHasUserError] = useState(false);

  const handleTittleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setHasTitleError(false);
  };

  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setUserId(+event.target.value);
    setHasUserError(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setHasTitleError(!title);
    setHasUserError(!userId);

    if (!title || !userId) {
      return;
    }

    const maxId = todos.length ? Math.max(...todos.map(todo => todo.id)) : 0;
    const user = users.find(u => u.id === userId);

    if (!user) {
      return;
    }

    const newTodo = {
      id: maxId + 1,
      title,
      userId,
      completed: false,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
    };

    setTodos(prevTodos => [newTodo, ...prevTodos]);
    setTitle('');
    setUserId(0);
  };

  return (
    <div className="App">
      <h1>Add todo form</h1>

      <form onSubmit={handleSubmit} action="/api/todos" method="POST">
        <div className="field">
          <label htmlFor="titleInput">Title</label>
          <input
            type="text"
            data-cy="titleInput"
            value={title}
            onChange={handleTittleChange}
          />
          {hasTitleError && <span className="error">Please enter a title</span>}
        </div>

        <div className="field">
          <label htmlFor="userInput">User</label>
          <select
            data-cy="userSelect"
            value={userId}
            required
            onChange={handleUserChange}
          >
            <option value="0" disabled>
              Choose a user
            </option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          {hasUserError && <span className="error">Please choose a user</span>}
        </div>

        <button type="submit" data-cy="submitButton">
          Add
        </button>
      </form>
      <TodoList todos={todos} users={users} />
    </div>
  );
};
