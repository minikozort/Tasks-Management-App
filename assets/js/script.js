// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
taskList = Array.isArray(taskList) ? taskList : [];
// I added this function to ensure that taskList is always in an array so you can use .push
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;


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
        .attr('data-task-id', task.id);
    const cardHeader = $('<div>').addClass('card-header h4').text(task.title);
    const cardBody = $('<div>').addClass('card-body');
    const cardDescription = $('<p>').addClass('card-text').text(task.description);
    const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate);
    const cardDeleteBtn = $('<button>')
        .addClass('btn btn-danger delete')
        .text('Delete')
        .attr('data-task-id', task.id);
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

//Todo: create a function to render the task list and make cards draggable
function renderTaskList(taskList) {

    if (!taskList) {
        taskList = []
    }

    // for (let task of taskList) {
    //     if (taskList.status === 'to-do') {
    //       todoList.append(createProjectCard(project));
    //     } else if (taskList.status === 'in-progress') {
    //       inProgressList.append(createProjectCard(project));
    //     } else if (taskList.status === 'done') {
    //       doneList.append(createProjectCard(project));
    //     }
    //   }

    return taskList
};

// Todo: create a function to handle adding a new task
function handleAddTask(event) {

    event.preventDefault();

    // ? Read user input from the form
    const taskTitleInputEl = $('#title-name-input').val();
    const taskDueDateInputEl = $('#taskDueDate').val();
    const taskDescriptionInputEl = $('#message-text').val();


    const newTask = {
        id: generateTaskId(),
        title: taskTitleInputEl,
        description: taskDueDateInputEl,
        dueDate: taskDescriptionInputEl,
        status: 'to-do'
    };


    taskList.push(newTask);

    localStorage.setItem('tasks', JSON.stringify(newTask));


    $('#to-do').append(createTaskCard(newTask));



    // Clear the form inputs
    $('#title-name-input').val('');
    $('#taskDueDate').val('');
    $('#message-text').val('');
    $('#addTaskBtn').click(function(){
        $('#exampleModal').modal('hide');
    });



}



// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    event.preventDefault();
    $(this).closest('.card').remove();


}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    $(event)
        .addClass("ui-state-highlight")
        .find("p")


}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

    console.log(taskList);

    renderTaskList();
    $('#taskForm').on('submit',handleAddTask);

   
    $(function () {
        $("#taskDueDate").datepicker();
    });


});



