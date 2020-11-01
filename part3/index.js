require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const Person = require("./models/person");
const cors = require("cors");

// let persons = [
//   { id: 1, name: "Arto Hellas", number: "040-123456" },
//   { id: 2, name: "Ada Lovelace", number: "39-44-5323523" },
//   { id: 3, name: "Dan Abramov", number: "12-43-234345" },
//   { id: 4, name: "Mary Poppendik", number: "39-23-6423122" },
// ];

const app = express();

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
app.use(express.static("build"));

app.get("/api/persons", (req, resp) => {
  Person.find({}).then((persons) => resp.json(persons));
});

app.post("/api/persons", (req, resp) => {
  const body = req.body;
  if (!body.name || !body.number) {
    return response.status(400).json({ error: "missing required parameters" });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });
  person.save().then((savedPerson) => {
    resp.json(savedPerson);
  });
  // const exists = persons.find((person) => person.number === req.body.number);
  // if (!req.body.name || !req.body.number) {
  //   return resp.status(400).json({
  //     error: "missing required parameters",
  //   });
  // }
  // if (exists) {
  //   return resp.status(400).json({
  //     error: "number already exists",
  //   });
  // }
});

app.get("/api/persons/:id", (req, resp) => {
  Person.findById(req.params.id).then((person) => {
    resp.json(person);
  });
});

app.delete("/api/persons/:id", (req, resp) => {
  Person.findByIdAndRemove(req.params.id)
    .then((person) => resp.status(204).end())
    .catch((err) => next(err));
});

app.get("/info", (req, resp) => {
  resp.send(
    `<p>Phonebook has info for ${number} people</p><p>${new Date()}</p>`
  );
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
