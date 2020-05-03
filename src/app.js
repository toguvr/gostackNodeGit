const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function validateProjectId(request, response, next){
  const {id} = request.params

  if(!isUuid(id)){
    return response.status(400).json({error: 'Invalid project ID'}) 
  }

  return next()
}

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
  
});

app.post("/repositories", (request, response) => {
  const { title, url, techs} = request.body

  const project = {
    id: uuid(),
    title,
    url,
    likes: 0,
    techs,
  }

  repositories.push(project)

  return response.json(project)
});

app.put("/repositories/:id", validateProjectId, (request, response) => {
  const {id} = request.params
  const {title, url, techs} = request.body

  const repoIndex = repositories.findIndex(repo=> repo.id === id)

  if(repoIndex === -1){
    return response.status(400).json({error: 'Repo not found.'})
  }

  repositories[repoIndex].title = title
  repositories[repoIndex].url = url
  repositories[repoIndex].techs = techs

  return response.json(repositories[repoIndex])

});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params

  const repoIndex = repositories.findIndex(repo=> repo.id === id)

  if(repoIndex === -1){
    return response.status(400).json({error: 'Repo not found.'})
  }

  repositories.splice(repoIndex, 1)

  return response.status(204).send()

});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params

  const repoIndex = repositories.findIndex(repo=> repo.id === id)

  if(repoIndex === -1){
    return response.status(400).json({error: 'Repo not found.'})
  }

  repositories[repoIndex].likes = repositories[repoIndex].likes + 1

  return response.json(repositories[repoIndex])

});

module.exports = app;
