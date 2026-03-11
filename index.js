const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

let todos = [];
let nextId = 1;

app.get('/api/todos', (req, res) => {
  res.json(todos);
});

app.post('/api/todos', (req, res) => {
  if (!req.body.text || req.body.text.trim() === '') {
    return res.status(400).json({ error: 'Text required' });
  }
  const todo = {
    id: nextId++,
    text: req.body.text.trim(),
    done: false,
    createdAt: new Date().toISOString()
  };
  todos.push(todo);
  res.json(todo);
});

app.patch('/api/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (todo) todo.done = !todo.done;
  res.json(todo);
});

app.delete('/api/todos/:id', (req, res) => {
  todos = todos.filter(t => t.id !== parseInt(req.params.id));
  res.json({ message: 'Deleted' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});