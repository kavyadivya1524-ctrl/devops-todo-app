const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

let todos = [];

// Get all todos
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

// Add new todo
app.post('/api/todos', (req, res) => {
  const todo = {
    id: Date.now(),
    text: req.body.text,
    done: false
  };
  todos.push(todo);
  res.json(todo);
});

// Delete todo
app.delete('/api/todos/:id', (req, res) => {
  todos = todos.filter(t => t.id !== parseInt(req.params.id));
  res.json({ message: 'Deleted' });
});

app.listen(3000, () => {
  console.log('App running on port 3000');
});