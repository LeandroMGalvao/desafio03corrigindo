const express = require("express");

const { v4: uuidv4, validate } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function checksExistsrepositories(request, response, next) {
  const {title} = request.headers;
  const repository = repositories.find(repository => repository.title === title);
  if(!repository){
    return response.status(404).json({error:"repositorio não encontrado!"})
  }
  request.repository = repository;
  return next();

};

app.get("/repositories",(request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
 
  const repository = {
    id: uuidv4(),
    title,
    url,
    techs,
    likes: 0
  };
  repositories.push(repository);

  return response.status(201).json(repository);
});



app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body
  const { id } = request.params;
 
  const repo = repositories.findIndex(repository => repository.id === id);
  if (repo < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  else{
    const repository = {
      ...repositories[repo],
      title,
      url,
      techs
    };
  
    repositories[repo] = repository;
    return response.json(repository);
  };

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories[repositoryIndex].likes++;

  return response.send(repositories[repositoryIndex]);
});

module.exports = app;
