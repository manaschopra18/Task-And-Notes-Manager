const { db, Tasks, Notes } = require('./db');

db.sync();

//Initializing database with some values
async function task() {

    await Tasks.bulkCreate([
        { title:'NodeJS', description:'handles backend for applications',dueDate:'2020-04-15'},
        { title:'AngularJS', description:'',dueDate:'2020-04-15',status:'incomplete',priority:'High'}

      ])
    await Notes.bulkCreate([
      {note:"do assignment", TaskId:"1"},
      {note:"complete online course ", TaskId:"1"}, 
      {note:"do assignment", TaskId:"2"},
      {note:"complete online course", TaskId:"2"},

      ])
}
task();
