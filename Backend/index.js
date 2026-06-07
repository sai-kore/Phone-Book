const express = require("express");
const app = express();
const cors = require('cors')

app.use(cors())
app.use(express.static('dist'))

let persons = [
  {
    name: "Hello",
    number: "1234",
    id: "1",
  },
  {
    name: "Oggy",
    number: "986",
    id: "2",
  },
];

app.use(express.json());

const requestLogger = (req, res, next) => {
  console.log("Method:", req.method);
  console.log("Path:  ", req.path);
  next();
};

app.use(requestLogger);

app.get("/", (req, res) => {
  res.send("<h1>Hello there how's your day going!</h1>");
});

app.get("/persons", (req, res) => {
  res.json(persons);
});

app.get("/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

// const generateId = () => {
//   const maxID =
//     persons.length > 0 ? Math.max(...persons.map((n) => Number(n.id))) : 0;
//   return String(maxID + 1);
// };

const generateId = () => String(Date.now());

app.post("/persons", (req, res) => {
  const body = req.body;

  if (!body.name) {
    return res.status(400).json({
      error: "name is missing",
    });
  }
  
  if (!body.number) {
    return res.status(400).json({
      error: "number is missing",
    });
  }
  
  const existingPerson = persons.find(
    person => person.name === body.name
  );
  
  if (existingPerson) {
    return res.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };
  persons = persons.concat(person);

  res.json(person);
});

app.put("/persons/:id", (req, res) => {
  const id = req.params.id;
  const body = req.body;

  const person = {
    name: body.name,
    number: body.number,
    id,
  };

  persons = persons.map((p) =>
    p.id === id ? person : p
  );

  res.json(person);
});

app.delete("/persons/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
