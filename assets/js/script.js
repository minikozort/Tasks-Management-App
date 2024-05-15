// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));
const taskTitleInputEl = $('#title-name-input');
const taskDueDateInputEl = $('#taskDueDate');
const taskDescriptionInputEl = $('#message-text');


// Todo: create a function to generate a unique task id
function generateTaskId() {
    if (nextId === null) {
        nextId = 1;
    }
    else {
        nextId++

    }
    localStorage.setItem('nextId', JSON.stringify(nextId));

    return nextId;


}


// Todo: create a function to create a task card
function createTaskCard(task) {
    const taskCard = $('<div>')
        .addClass('card project-card draggable my-3')
    const cardHeader = $('<div>').addClass('card-header h4').text(task.title);
    const cardBody = $('<div>').addClass('card-body');
    const cardDescription = $('<p>').addClass('card-text').text(task.description);
    const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate);
    const cardDeleteBtn = $('<button>')
        .addClass('btn btn-danger delete')
        .text('Delete')
    cardDeleteBtn.on('click', handleDeleteTask);


    // Sets the card background color based on due date. Only apply the styles if the dueDate exists and the status is not done.
    if (task.dueDate && task.status !== 'done') {
        const now = dayjs();
        const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');

        // ? If the task is due today, make the card yellow. If it is overdue, make it red.
        if (now.isSame(taskDueDate, 'day')) {
            taskCard.addClass('bg-warning text-white');
        } else if (now.isAfter(taskDueDate)) {
            taskCard.addClass('bg-danger text-white');
            cardDeleteBtn.addClass('border-light');
        }
    }

    // ? Gather all the elements created above and append them to the correct elements.
    cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
    taskCard.append(cardHeader, cardBody);
   

    // ? Return the card so it can be appended to the correct lane.
    return taskCard;



}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    var taskList = [taskTitleInputEl, taskDueDateInputEl, taskDescriptionInputEl];

    $.each(taskList, function (_index, taskCard) {
        $('#to-do').append(taskCard);
    });
};

// Todo: create a function to handle adding a new task
function handleAddTask(event) {

    event.preventDefault();
    

    localStorage.setItem('tasks', JSON.stringify(taskList));

    // ? Read user input from the form
    const taskTitle = $('taskTitleInputEl:input').val;
    const taskDueDate = $('taskDueDateInputEl:input').val;
    const taskDescription = $('taskDescriptionInputEl:input').val;


    const newTask = {
        // ? Here we use a Web API called `crypto` to generate a random id for our project. This is a unique identifier that we can use to find the project in the array. `crypto` is a built-in module that we can use in the browser and Nodejs.    id: crypto.randomUUID(),
        name: taskTitle,
        description: taskDescription,
        dueDate: taskDueDate,
        status: 'to-do',
        
    };

    // ? Pull the projects from localStorage and push the new project to the array
    const tasks = newTasks
    tasks.push(newTask);


    // ? Clear the form inputs
    taskTitleInputEl.val('');
    taskDescriptionInputEl.val('');
    taskDueDateInputEl.val('');

}



// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
 event.preventDefault();
 $(this).closest('.card').remove();


}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    $( event )
    .addClass( "ui-state-highlight" )
    .find( "p" )
    

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

    $(function () {
        $("#taskDueDate").datepicker();
    });


    $('#taskForm').on('submit', createTaskCard);
});



