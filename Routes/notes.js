const { Router } = require('express')

const { Notes} = require('../Database/db')
const { Tasks} = require('../Database/db')

const route = Router()


//GET Notes WITH Task ID
route.get('/:id/notes',  async (req, res) => {
    if (isNaN(Number(req.params.id))) {
        return res.status(400).send({
          error: 'task id must be an integer',
        })
      }
  
    const notes = await Notes.findAll({where: {TaskId:req.params.id}})

    res.send(notes)
})


//ADD NOTES TO TASK WITH TASK ID
route.post('/:id/notes',  async (req, res) => {

    const idList= await Tasks.findAll({
        attributes:['id'] 
      });

    if(!(req.params.id in idList))
    {
        return res.status(404).send({ error: 'No task found with id = ' + req.params.id})
    }
    
    await Notes.create({
        note: req.body.note,
        TaskId:req.params.id
    });

    return res.status(201).send({ success: 'New note added' }) 
})

//EXPORTING THE MODULE
module.exports = route