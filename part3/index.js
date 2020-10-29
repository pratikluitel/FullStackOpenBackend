const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

let persons = [
  { id: 1, name: "Arto Hellas", number: "040-123456" },
  { id: 2, name: "Ada Lovelace", number: "39-44-5323523" },
  { id: 3, name: "Dan Abramov", number: "12-43-234345" },
  { id: 4, name: "Mary Poppendick", number: "39-23-6423122" },
];

const app = express();
const number = persons.length;

morgan.token("body", function (req, res) {
  if (req.method === "POST" && res.statusCode === 200)
    return JSON.stringify({ name: req.body.name, number: req.body.number });
  else return null;
});

app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.use(cors());

app.get("/api/persons", (req, resp) => {
  resp.json(persons);
});

app.post("/api/persons", (req, resp) => {
  const exists = persons.find((person) => person.number === req.body.number);
  if (!req.body.name || !req.body.number) {
    return resp.status(400).json({
      error: "missing required parameters",
    });
  }
  if (exists) {
    return resp.status(400).json({
      error: "number already exists",
    });
  }
  const newPerson = {
    id: Math.floor(Math.random() * 1000),
    name: req.body.name,
    number: req.body.number,
  };
  resp.json(newPerson);
  persons = persons.concat(newPerson);
});

app.get("/api/persons/:id", (req, resp) => {
  const selected = persons.find(
    (person) => person.id === Number(req.params.id)
  );
  if (selected) {
    resp.json(selected);
  } else {
    resp.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, resp) => {
  persons = persons.filter((person) => person.id !== Number(req.params.id));
  resp.status(204).end();
});

app.get("/info", (req, resp) => {
  resp.send(
    `<p>Phonebook has info for ${number} people</p><p>${new Date()}</p>`
  );
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
