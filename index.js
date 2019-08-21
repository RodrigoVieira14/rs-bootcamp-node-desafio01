const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

let numberRequest = 0;


//verifica se o projeto atende todos os requisitos
function checkInsertProjects(req, res, next){

  const { id, title } = req.body;
  const project = projects.find( item => item.id == id);

  if(project){
    return res.status(400).json({ error: 'ID in use' })
  }
  
  if(!id){
    return res.status(400).json({message : 'Error in json format of ID field'});
  }

  if(!title){
    return res.status(400).json({message : 'Error in json format of TITLE field'});
  }
  
  return next();

}

function checkProjectExist(req, res, next){

  const { id } = req.params;
  const project = projects.find( item => item.id == id);

  if(!project){
    return res.status(400).json({ error: 'Project not found' })
  }

  return next();

}

//log - conta quantas requisições foram feitas
server.use((req, res, next) => {
  numberRequest++;

  console.info(`Requisições: ${numberRequest}`);

  next();

})

// lista todos os projetos
server.get('/projects', (req, res) => {
  return res.json(projects);
});

//lista um projeto pelo id
server.get('/projects/:id', (req, res) => {

  const { id } = req.params;

  const array = projects.filter( item =>  item.id == id )
  
  return res.json(array);

});

//cria um projeto
server.post('/projects', checkInsertProjects, (req, res) => {

  const { title, id } = req.body;

  const project = {
    id,
    title, 
    tasks:[]
  }

  projects.push(project);

  return res.json(projects);

});

// altera o titulo do projeto
server.put('/projects/:id', checkProjectExist, (req, res) => {
   const { id } = req.params;
   const { title } = req.body;

   const project = projects.find( item => item.id == id);

   project.title = title;

   return res.json(project);

   
});


// insere as tarefas do projeto
server.post('/projects/:id/tasks', checkProjectExist,  (req, res) => {

  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(item => item.id == id);

  project.tasks.push(title);

  return res.json(project);

});

// deleta o projeto pelo ID
server.delete('/projects/:id', checkProjectExist,  (req, res) => {

  const { id } = req.params;

  const index = projects.findIndex(item => item.id == id);

  projects.splice(index,1);

  return res.send();


});


server.listen(4000);