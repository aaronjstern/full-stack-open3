require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");
const mongoose = require("mongoose");

let personsHardCode = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.use(morgan("tiny"));
app.use(express.json());
app.use(cors());
app.use(express.static("build"));

app.get("/api/persons", (request, response) => {
  Person.find({}).then((result) => {
    response.json(result);
  });
});

app.get("/info", (request, response) => {
  const numPersons = persons.length;
  const requestTime = new Date();
  response.send(`
  <p>Phone book has info for ${numPersons} people</p>
    <p>${requestTime}</p>
    `);
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(404).json({
      error: "missing name or number",
    });
  } else {
    const person = new Person({
      name: body.name,
      number: body.number,
    });
    person.save().then((savedPerson) => {
      response.json(savedPerson);
    });
  }
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);

  const person = persons.find((person) => person.id === id);
  if (person) {
    return response.json(person);
  } else {
    return response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((p) => p.id !== id);
  response.status(204).end();
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`LISTENING ON PORT ${PORT}`);
});
