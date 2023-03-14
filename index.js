const express = require('express'); // express function imported
const cors = require('cors');
const app = express(); // invoke express to create express application

app.use(express.json()); // activate express' json-parser
app.use(cors());
app.use(express.static('dist'));

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  },
  {
    id: 4,
    content: "test change",
    important: true
  }
];

// get route handles requests to '/'
// request: all information in HTTP request
// response: defines response to request
// sends response containing string
app.get('/', (request, response) => { 
  response.send('<h1>Hello World!</h1>') 
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find(note => note.id === id);

  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter(note => note.id !== id);

  response.status(204).end();
});

const generateId = () => {
  const maxId = notes.length > 0
  ? Math.max(...notes.map(note => note.id))
  : 0;

  return maxId + 1;
};

app.post('/api/notes', (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(404).json({
      error: 'content missing'
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  }

  notes = notes.concat(note);
  response.json(note);
});

const PORT = 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})