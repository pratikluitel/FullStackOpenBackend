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

app.use(express.static("build"));
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.use(cors());

app.get("/api/persons", (req, resp, next) => {
  Person.find({})
    .then((persons) => resp.json(persons))
    .catch((err) => next(err));
});

app.post("/api/persons", (req, resp, next) => {
  if (!req.body.name || !req.body.number) {
    return next({ name: "ParamMissing" });
  }

  const person = new Person({
    name: req.body.name,
    number: req.body.number,
  });
  person
    .save()
    .then((savedPerson) => {
      resp.json(savedPerson);
    })
    .catch((err) => next(err));
});

app.put("/api/persons/:id", (req, resp, next) => {
  if (!req.body.number) {
    return next({ name: "ParamMissing" });
  }
  const person = {
    name: req.body.name,
    number: req.body.number,
  };
  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatedPerson) => resp.json(updatedPerson))
    .catch((err) => next(err));
});

app.get("/api/persons/:id", (req, resp, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) resp.json(person);
      else resp.status(404).end();
    })
    .catch((err) => next(err));
});

app.delete("/api/persons/:id", (req, resp, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((person) => resp.status(204).end())
    .catch((err) => next(err));
});

app.get("/info", (req, resp, next) => {
  Person.count()
    .then((count) =>
      resp
        .send(
          `<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`
        )
        .end()
    )
    .catch((err) => next(err));
});

const unknownEndpoint = (req, resp) => {
  resp.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (err, req, resp, next) => {
  console.log(err.message);
  if (err.name === "CastError") {
    return resp.status(400).send({ error: "Malformatted id" });
  }
  if (err.name === "ParamMissing") {
    return resp.status(400).json({ error: "missing required parameters" });
  }
  next(err);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
