const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

function logRequests (request, response, next) {
  const { method, url } = request;

  logLabel = `[${method.toUpperCase()}] ${url}`;
  console.log(logLabel);

  return next();
}

function validateId(request, response, next) {
  const { id } = request.params;

  if (!isUuid === id) {
    return response.status(400).json({ error: 'Invalid repository Id'});
  }

  return next();
}

const repositories = [];
app.use('/repositories/:id', validateId);
app.use('/repositories/:id/like', validateId);

app.get("/repositories", (request, response) => {
  const { title } = request.query
  const result = title
    ? repositories.findIndex( repository => repository.title === title)
    : repositories;

  return response.json(result);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs: [],
    likes: 0
  }

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex ( repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex( repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'repository not found' });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).json();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex ( repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'repository not found' });
  }
  repositories[repositoryIndex].likes += 1;

  return response.status(200).json(repositories[repositoryIndex]);
});

module.exports = app;
