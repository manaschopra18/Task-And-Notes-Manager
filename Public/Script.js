document.addEventListener("DOMContentLoaded", function()
{
    loadContents();
    AddDateToForm();
});

function AddDateToForm()
{
    var tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    var mm="", dd=""; 
    if(tomorrow.getMonth()+1 < 10)
        mm="0"+(tomorrow.getMonth()+1);
    else
        mm=tomorrow.getMonth()+1;
    if(tomorrow.getDate() < 10)
        dd="0"+tomorrow.getDate();
    else 
        dd=tomorrow.getDate();
        
    document.getElementById('dueDate').value=tomorrow.getFullYear()+"-"+mm+"-"+dd;
}


async function loadContents()
{
    var tasks=getAllTasks();
    var data=await Promise.resolve(tasks);
    //console.log(data[0]);

    //Object.keys(data).length
    var taskList=document.getElementById("task-list");
    for(let i=0; i<Object.keys(data).length; i++)
    {
        let task= createTask(data[i].id,data[i].title,data[i].description,data[i].dueDate,data[i].status,data[i].priority);
        taskList.appendChild(task);
    }

    
}


async function getAllTasks()
{
    return await fetch('/tasks', { method: 'GET' })
        .then(resp => {return resp.json() })
        .then(data => { return data; })
        .catch(err => {return err})
}

function createTask(id,title,description,dueDate,status,priority)
{
    let task=document.createElement('div');
    task.classList.add("task","card","flexbox");
    task.id=id;

    // editButton
    let editButton=document.createElement('button');
    editButton.setAttribute("taskid",id);
    editButton.classList.add("fa","fa-edit","editButton");
    editButton.addEventListener('click',ShowUpdateForm);
    task.appendChild(editButton); // added editButton
    
    //TASK INFO 
    let taskInfo= document.createElement('div');
    taskInfo.classList.add("flexbox","col-12","col","task-info");
    taskInfo.setAttribute("taskid",id);

    //CARD HEADER
    let cardHeader= document.createElement('div');
    cardHeader.classList.add("card-header","col-12","flexbox");

    //H5
    let h5=document.createElement('h5');
    h5.innerText=title;
    cardHeader.appendChild(h5); // added h5
    taskInfo.appendChild(cardHeader); // added CARD HEADER

    //CARD BODY
    let cardBody=document.createElement('div');
    cardBody.classList.add('flexbox','col-10','sol-sm-11');

    let p=document.createElement('p');
    p.classList.add("card-text","col-12","pt-3");
    p.innerText=description;
    cardBody.appendChild(p); // added p

    //span date
    let spanDate=document.createElement('span');
    spanDate.classList.add("col-sm-6");
    spanDate.innerHTML="Due Date : <span class='task-dueDate'> "+ dueDate +" </span>";
    cardBody.appendChild(spanDate); // added span date

    //span priority
    let spanPriority=document.createElement('span');
    spanPriority.classList.add("col-sm-6");
    spanPriority.innerHTML="Priority: <strong class='task-priority'> "+ priority +" </strong>";
    cardBody.appendChild(spanPriority);// added span priority
    taskInfo.appendChild(cardBody); // added card body

    //status div
    let statusDiv= document.createElement('div');
    statusDiv.classList.add("col-2","col-sm-1","status"); 

    //checkbox
    let checkbox= document.createElement('input');
    checkbox.type="checkbox";
    checkbox.setAttribute("taskid",id);
    if(status == 'incomplete')
    {
        checkbox.checked=false;
    }
    else
    {
        checkbox.checked=true;
    }

    checkbox.addEventListener('click',function (){
        event.stopPropagation();
        //console.log("checked ? = ", this.checked)
        var updated = updateStatus(this.getAttribute('taskid'), this.checked);
        if(!updated)
        {
            this.checked=false;
        }
    })
    statusDiv.appendChild(checkbox); // added checkbox
    taskInfo.appendChild(statusDiv); // added status div
    task.appendChild(taskInfo);

    task.addEventListener('click',toggleNotes);

    return task;

}

//function (){this.classList.toggle("hide");}
function toggleNotes()
{
    var id=this.id;

    let counter=0;
    var taskNotes=document.getElementsByClassName("task-notes");
    for(let i=0;i<taskNotes.length;i++)
    {
        if(taskNotes[i].getAttribute('taskid')==id)
        {
            taskNotes[i].classList.toggle("hide");
            counter=1;
            break;

        }
    }
    if(counter == 0)
    {
        var notes= getAllNotes(id);
        AddNotesToTask(id, notes);
    }

}

async function getAllNotes(id)

{   let url="/tasks/"+id+"/notes";
    return await fetch(url, { method: 'GET' })
            .then(resp =>{ return resp.json()})
            .then(data => { return data;})
            .catch(err => {return err})
}

async function AddNotesToTask(id, notes)
{
    //task notes
    let taskNotes= document.createElement('div');
    taskNotes.classList.add("flexbox","col-12","task-notes");
    taskNotes.setAttribute("taskid",id);

    //notes body
    let notesCardBody=document.createElement('div');
    notesCardBody.classList.add("card-body");

    //notes card header
    let notesCardHeader = document.createElement('div');
    notesCardHeader.classList.add("card-header","col-12");
    notesCardHeader.innerHTML="<h5>Notes</h5></div>";
    notesCardBody.appendChild(notesCardHeader); // added notes card header

    //ul
    let ul = document.createElement('ul');
    ul.classList.add("list-group","list-group-flush");
    ul.id="notes-ul-"+id;
    ul.setAttribute("taskid",id);
    //first Li input and button(add note)
    let inputLi=document.createElement('li');
    inputLi.classList.add("list-group-item","flexbox","col-12","p-0")

    //input 
    let input=document.createElement('input');
    input.id="note-input-"+id;
    input.classList.add("form-control","col-9","col-sm-10");
    input.type="text";
    input.placeholder="  add a note";
    input.addEventListener('click',()=> {event.stopPropagation()});
    inputLi.appendChild(input); // added input

    let button=document.createElement('button');
    button.classList.add("btn","btn-info","col-3","col-sm-2");
    button.id="add-"+id;
    button.setAttribute("taskid",id);
    button.type="submit";
    button.addEventListener('click',addNewNote)
    button.innerText="Add";
    inputLi.appendChild(button); // added button

    ul.appendChild(inputLi); //added input Li

    var data=await Promise.resolve(notes);

    for(let i=0;i<data.length;i++)
    {
        let li = document.createElement('li');
        li.classList.add("list-group-item");
        li.innerText=data[i].note;

        ul.appendChild(li);
    }
    notesCardBody.appendChild(ul); // added ul
    taskNotes.appendChild(notesCardBody); // added notes card body

   let task=document.getElementById(id); // added taskNotes
    task.appendChild(taskNotes);
}

async function updateStatus(id,checked)
{
    if(checked==true)
    {
        var status="completed";
    }
    else{
        var status="incomplete";
    }
    
    return await fetch('/tasks/'+id, {
        method:'PATCH',
        headers: {
            "Content-Type": "application/json"
          },
        body:JSON.stringify({
            'status':status})
    }).catch(() => {return false})
    .then(resp => { 
        return resp.json();
    }).then(data =>{ return data.updated;})
    .catch(err=>{return false;})
}

async function addNewNote()
{   event.stopPropagation();

   let newNote= document.getElementById("note-input-"+this.getAttribute('taskid')).value;
   if(newNote == "")
   { return;}

    await fetch('/tasks/'+this.getAttribute('taskid')+'/notes',{
        method:'POST',
        headers: {
            "Content-Type": "application/json"
          },
        body:JSON.stringify({"note":newNote})
    })
    .then(resp => { return resp.json()})
    .then(data => { 
        if (data.success!=null)
        { 
            let notesUlId=document.getElementById("notes-ul-"+this.getAttribute('taskid'));
            let newLi=document.createElement('Li');
            newLi.classList.add("list-group-item");
            newLi.innerText=newNote;
            notesUlId.appendChild(newLi);
            document.getElementById("note-input-"+this.getAttribute('taskid')).value="";
        }
    })
    .catch(err => {console.log(err);})

}


//To add new task in database

async function AddNewTask()
{
    let title= document.getElementById('title').value;
    //mandatory field
    if(title=="")
        return;
    let description= document.getElementById('description').value;
    let dueDate=document.getElementById('dueDate').value;
    let status="incomplete";
    let priority= document.getElementById('priority').value;

    console.log("description="+ description);
    await fetch('/tasks',{
        method:'POST',
        headers: {
            "Content-Type": "application/json"
          },
        body:JSON.stringify({
            "title":title,
            "description":description,
            "dueDate":dueDate,
            "status":status,
            "priority":priority
        })
    })
    .then(resp => { return resp.json()})
    .then(data => { 
        if (data.success!=null)
        { 
            //Append new task to document
            //createTask(data.data.id,data.data.title,data.data.description,data.data.dueDate,data.data.status,
            //    data.data.priority);
        }
    })
    .catch(err => {console.log(err);})

}

async function ShowUpdateForm()
{
    event.stopPropagation();
    var myModal = document.getElementById("myModal");
    myModal.setAttribute("taskid",this.getAttribute('taskid'));

    myModal.classList.toggle('hide');

    await fetch('/tasks/'+this.getAttribute('taskid'),{ method:'GET' })
    .then(resp => { return resp.json();})
    .then(data => { 
        document.getElementById('editDueDate').value=data.dueDate;
        document.getElementById('editPriority').value=data.priority;
        document.getElementById('editStatus').checked= data.status=='incomplete'?false:true;
    })
    .catch(err => {console.log(err);})
    
}

function HideModal()
{
    document.getElementById("myModal").classList.add('hide');
}

async function UpdateTask()
{
    let id=document.getElementById("myModal").getAttribute('taskid');

    let editDueDate = document.getElementById('editDueDate').value;
    let editPriority = document.getElementById('editPriority').value;
    let editStatus = document.getElementById('editStatus').checked;

    await fetch('/tasks/'+id, {
        method:'PATCH',
        headers: {
            "Content-Type": "application/json"
          },
        body:JSON.stringify({
            'dueDate':editDueDate,
            'priority':editPriority,
            'status':editStatus==true?'completed':'incomplete'
        })
    })
    .then(resp => { 
        return resp.json();
    }).then(data =>{ 
        if (data.updated)
        {
            alert(" Successfully updated Task.")
        }
    
    })
    .catch(err=>{console.log(err)})
}

async function sort(id)
{
    console.log(id);

    var tasks=getAllTasks();
    var data=await Promise.resolve(tasks);
 
    if(id=="sortByDateAscending")
        data.sort((a,b) =>  {return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()});
    else if(id=="sortByDateDescending")
        data.sort((a,b) =>  {return  new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()});
    else if(id=="sortByStatus")
    {
        var sValue={'incomplete':1,'completed':0};
        data.sort((a,b) =>  {return  sValue[b.status] - sValue[a.status]});
    }
    else{
        var pValue={'high':2,'medium':1, 'low':0 };
        data.sort((a,b) =>  {return  pValue[b.priority] - pValue[a.priority]});
    }

    document.getElementById("task-list").innerHTML="";
    var taskList=document.getElementById("task-list");
    for(let i=0; i<Object.keys(data).length; i++)
    {
        let task= createTask(data[i].id,data[i].title,data[i].description,data[i].dueDate,data[i].status,data[i].priority);
        taskList.appendChild(task);
    }
}