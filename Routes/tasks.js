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
    
    //validation status
    if(req.body.status !="incomplete" && req.body.status !='completed')
    {
      return res.status(400).send({ error: 'status can be incomplete or complete  '}) 
    }
    //validation priority
    if(req.body.priority.toLowerCase() !='low' && req.body.priority.toLowerCase() !='medium' && req.body.priority.toLowerCase() !="high")
    {
      return res.status(400).send({ error: 'priority can be Low, Medium or Hign only' }) 
    }

    const newTodo = await Tasks.create({
        title: req.body.title,
        description:req.body.description,
        dueDate: req.body.dueDate,
        status: req.body.status.toLowerCase(),
        priority:req.body.priority.toLowerCase()
    })

    res.status(201).send({ data:newTodo ,success: 'New task added' })
  })

// UPDATE A TASK
route.patch('/:id', async (req, res) => {

  if (isNaN(Number(req.params.id))) {
    return res.status(400).send({
      updated: false ,
      error: 'task id must be an integer'
    })
  }

  //Checking if entered Taskid exists in database
  const idList= await Tasks.findOne({where:{id:req.params.id} 
  });

  if (idList==null)
  {
    return res.status(400).send({ updated: false , error: 'task ID :'+ req.params.id + ' doen`t exist. '}) 
  }

 //validation status
 if(req.body.status.toLowerCase() !="incomplete" && req.body.status.toLowerCase() !="completed")
 {
   return res.status(400).send({ updated: false , error: 'status can be incomplete or completed only' }) 
 }

  //if only status needs to be updated
  if(!req.body.dueDate && !req.body.priority )
  {
      const updateTask = await Tasks.update({
      status: req.body.status},
      {where:{id:req.params.id}
    })

  return res.status(201).send({ updated: true , success: 'task updated.' })
  
  }

  //if other info also provided, validating
  if(typeof req.body.dueDate !== 'string' || typeof req.body.priority !== 'string')
  {
    return res.status(400).send({ updated: false , error: 'Task dueDate not provided' }) 
  }

  //checkinf if taskId exists in database
 
  const updateTask = await Tasks.update({
    dueDate: req.body.dueDate,
    status: req.body.status.toLowerCase(),
    priority:req.body.priority.toLowerCase()

}, {where:{id:req.params.id}})

if(updateTask)
    return res.status(201).send({ updated: true , success: 'task updated.' })
else
    return res.status(500).send({ updated: false , error:"Couldn`t update data. Try again later" })
})

//EXPORTING THE MODULE
module.exports = route
    
