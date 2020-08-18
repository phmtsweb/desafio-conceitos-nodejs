const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4');

// const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const validationID = (request, response, next) => {
    const { id } = request.params;
    if (!isUuid(id)) {
        return response.status(400).json({ error: 'Id is not valid!' });
    }
    return next();
};

app.use('/repositories/:id', validationID);

app.get("/repositories", (request, response) => {
    return response.json(repositories);
});

app.post("/repositories", (request, response) => {
    const { title, url, techs } = request.body;
    const likes = 0;
    if (!(title && url && techs)) {
        return response.status(400).json({ error: 'Invalid fields!' });
    }
    const repository = {
        id: uuid(),
        title,
        url,
        techs,
        likes
    }
    repositories.push(repository);
    return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
    const { id } = request.params;
    const repositoryIndex = repositories.findIndex(repository => repository.id === id);
    if (repositoryIndex < 0) {
        return response.status(400).json({ error: 'Repository not found' });
    }
    const { title, url, techs } = request.body;
    //Trecho para validar o preenchimento correto dos parâmetros
    // if (!(title && url && techs)) {
    //     return response.status(400).json({ error: 'Fields are not valids' });
    // }
    // title = title || repositories[repositoryIndex].title;
    // url = url || repositories[repositoryIndex].url;
    // techs = techs || repositories[repositoryIndex].techs;
    const repository = {...repositories[repositoryIndex], title, url, techs };
    repositories[repositoryIndex] = repository;
    return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
    const { id } = request.params;
    const repositoryIndex = repositories.findIndex(repository => repository.id === id);
    if (repositoryIndex < 0) {
        return response.status(404).json({ error: 'Repository cannot be deleted' });
    }
    repositories.splice(repositoryIndex, 1);
    return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
    const { id } = request.params;
    const repositoryIndex = repositories.findIndex(repository => repository.id === id);
    if (repositoryIndex < 0) {
        return response.status(400).json({ error: 'Repository not found' });
    }
    repositories[repositoryIndex].likes++;
    return response.json(repositories[repositoryIndex]);
});

module.exports = app;