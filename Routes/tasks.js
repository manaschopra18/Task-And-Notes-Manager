const { Router } = require('express')

const { Tasks} = require('../Database/db')

const route = Router()

// GET ALL TASKS
route.get('/', async (req, res) => {
    const tasks = await Tasks.findAll()
    res.send(tasks)
  })

//GET TASK WITH ID
route.get('/:id',  async (req, res) => {
    if (isNaN(Number(req.params.id))) {
      return res.status(400).send({
        error: 'task id must be an integer',
      })
    }

    const task = await Tasks.findByPk(req.params.id,{include: ['notes']})

    if (!task) {
      return res.status(404).send({
      error: 'No task found with id = ' + req.params.id,
    })
  }
  res.send(task)
})

//ADD NEW TASK 
route.post('/', async (req, res) => {
    if (typeof req.body.title !== 'string') {
      return res.status(400).send({ error: 'Task title not provided' })
    }
    if(typeof req.body.dueDate !== 'string')
    {
      return res.status(400).send({ error: 'Task dueDate not provided' }) 
    }
    
    const newTodo = await Tasks.create({
        title: req.body.title,
        description:req.body.description,
        dueDate: req.body.dueDate,
        status: req.body.status,
        priority:req.body.priority
    })

    res.status(201).send({ success: 'New task added' })
  })

// UPDATE A TASK
route.patch('/:id', async (req, res) => {
  if (isNaN(Number(req.params.id))) {
    return res.status(400).send({
      updated: false ,
      error: 'task id must be an integer'
    })
  }
 
  if(typeof req.body.dueDate !== 'string')
  {
    return res.status(400).send({ updated: false , error: 'Task dueDate not provided' }) 
  }

 const idList= await Tasks.findAll({
    attributes:['id'] 
  });

  if (!(req.params.id in idList))
  {
    return res.status(400).send({ updated: false , error: 'task ID :'+ req.params.id + ' doen`t exist. '}) 
  }
  const updateTask = await Tasks.update({
    dueDate: req.body.dueDate,
    status: req.body.status,
    priority:req.body.priority

}, {where:{id:req.params.id}})

if(updateTask)
    res.status(201).send({ updated: true , success: 'task updated.' })
else
    res.status(500).send({ updated: false , error:"Couldn`t update data. Try again later" })
})


//EXPORTING THE MODULE
module.exports = route
    
