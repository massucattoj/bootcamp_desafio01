const express = require('express'); // importar framework express
const server = express(); 

server.use(express.json()); // avisar o express que a aplicacao utilizara entradas JSON

const projects = [];
var count = 0;

// |> Middlewares Globais <|
// Contagem de Requisicoes
server.use( (req,res, next) => {
    count +=1; 
    console.log(`Num de requisicoes realizadas: ${count}`);
    next();
})

// |> Middlewares Locais <|
function checkProjectExists(req, res, next) {
    const { id } = req.params   
    const index = projects.find( index => index.id === id);

    if(!index){
        return res.status(400).json({ error: "Project does not Exists" });
    }

    return next();
}

/*
    CRUD do Projeto
*/
// Criar projeto
server.post('/projects', (req, res) => {
    const { id } = req.body; 
    const { title } = req.body;        
     
    projects.push({ id, title, tasks:[] });

    return res.json(projects);
});

// Listar todos os projetos
server.get('/projects', (req, res) => {
    return res.json(projects);
});


// Alterar titulo do projeto
server.put('/projects/:id', checkProjectExists, (req,res) => {
    const { id } = req.params;
    const { title } = req.body;
    
    const project = projects.find( index => index.id === id);
    project.title = title;
    
    //console.log(index);    
    return res.json(project);
});

// Deletar projeto
server.delete('/projects/:id', checkProjectExists, (req, res) => {
    const { id } = req.params;

    const index = projects.findIndex( index => index.id === id);
    projects.splice(index, 1);

    return res.send();
});

// Adicionar tarefa ao projeto
server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find( index => index.id === id);
    project.tasks.push(title);

    //console.log(index);
    return res.json(project);
});

server.listen(3000);