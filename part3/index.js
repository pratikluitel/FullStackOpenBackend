express = require("express");

const persons = [
  { id: 1, name: "Arto Hellas", number: "040-123456" },
  { id: 2, name: "Ada Lovelace", number: "39-44-5323523" },
  { id: 3, name: "Dan Abramov", number: "12-43-234345" },
  { id: 4, name: "Mary Poppendick", number: "39-23-6423122" },
];

const app = express();
const number = persons.length;

app.get("/info", (req, resp) => {
  resp.status(200);
  resp.send(
    `<p>Phonebook has info for ${number} people</p><p>${new Date()}</p>`
  );
});

app.get("/api/persons", (req, resp) => {
  resp.status(200);
  resp.json(persons);
});

app.get("/api/persons/:id", (req, resp) => {
  const selected = persons.find(
    (person) => person.id === Number(req.params.id)
  );
  if (selected) {
    resp.status(200);
    resp.json(selected);
  } else {
    resp.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, resp) => {
  persons = persons.filter((person) => person.id !== Number(req.params.id));
  resp.status(204).end();
});

const PORT = 3001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
