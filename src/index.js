const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const user = users.find(u => u.username === username);

  if (!user) {
    return response.status(400).json({error: 'Username does not exists.'});
  }

  request.user = user;

  next();
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  const checkUsernameAlreadyExists = users.some(user => user.username === username)

  if (checkUsernameAlreadyExists) {
    return response.status(400).json({
      error: 'Username is already in use.'
    })
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  }

  users.push(user);

  return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { title, deadline } = request.body;

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  }

  user.todos.push(todo);

  return response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { title, deadline } = request.body;
  const { id } = request.params;

  const todo = user.todos.find(t => t.id === id);

  if(!todo) {
    return response.status(404).json({error: 'This todo does not exists.'});
  }

  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.json(todo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find(t => t.id === id);

  if(!todo) {
    return response.status(404).json({error: 'This todo does not exists.'});
  }

  todo.done = true;
  
  return response.json(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find(t => t.id === id);

  if(!todo) {
    return response.status(404).json({error: 'This todo does not exists.'});
  }

  user.todos.splice(todo, 1);

  return response.status(204).send();
});

module.exports = app;