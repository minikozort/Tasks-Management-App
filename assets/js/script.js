let taskList = JSON.parse(localStorage.getItem("tasks"));
taskList = Array.isArray(taskList) ? taskList : [];
// I added this function to ensure that taskList is always in an array so you can use .push
let nextId = JSON.parse(localStorage.getItem("nextId"));


// Generating a unique task id for each task
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

// Creating a task card for each added task
function createTaskCard(task) {
    const taskCard = $('<div>')
        .addClass('card task-card draggable my-3')
        .attr('data-task-id', task.id);
    const cardHeader = $('<div>').addClass('card-header h4').text(task.title);
    const cardBody = $('<div>').addClass('card-body');
    const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate);
    const cardDescription = $('<p>').addClass('card-text').text(task.description);
    const cardDeleteBtn = $('<button>')
        .addClass('btn btn-danger delete')
        .text('Delete')
        .attr('data-task-id', task.id);
    cardDeleteBtn.on('click', handleDeleteTask);


    // Sets the card background color based on due date. Only apply the styles if the dueDate exists and the status is not done.
    if (task.dueDate && task.status !== 'done') {
        const now = dayjs();
        const cardDueDate = dayjs(task.dueDate).format('MM/DD/YYYY');

        // If the task is due today, make the card yellow. If it is overdue, make it red.
        if (now.isSame(cardDueDate, 'day')) {
            taskCard.addClass('bg-warning text-white');
        } else if (now.isAfter(cardDueDate)) {
            taskCard.addClass('bg-danger text-white');
            cardDeleteBtn.addClass('border-light');
        }
    }

    // Gather all the elements created above and append them to the correct elements.
    cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
    taskCard.append(cardHeader, cardBody);

    //  Return the card so it can be appended to the correct lane.
    return taskCard;
}

// A function to render the task list and make the cards draggable
function renderTaskList() {

    if (!taskList) {
        taskList = []
    }

    // Empty existing project cards out of the lanes
    const todoList = $('#todo-cards');
    todoList.empty();
  
    const inProgressList = $('#in-progress-cards');
    inProgressList.empty();
  
    const doneList = $('#done-cards');
    doneList.empty();
  
    // Loop through cards and create card for each status
    for (let task of taskList) {
      if (task.status === 'to-do') {
        todoList.append(createTaskCard(task));
      } else if (task.status === 'in-progress') {
        inProgressList.append(createTaskCard(task));
      } else if (task.status === 'done') {
        doneList.append(createTaskCard(task));
      }
    }

    //  Use JQuery UI to make task cards draggable
    $('.draggable').draggable({
        opacity: 0.7,
        zIndex: 100,
    });

    return taskList
};

// Function that is handeling the "Add Task" event
function handleAddTask(event) {

    event.preventDefault();

    // Read user input from the form
    const taskTitleInputEl = $('#title-name-input').val();
    const taskDueDateInputEl = $('#taskDueDate').val();
    const taskDescriptionInputEl = $('#message-text').val();
    // Create a new task with the entered information
    const newTask = {
        id: generateTaskId(),
        title: taskTitleInputEl,
        dueDate: taskDueDateInputEl,
        description: taskDescriptionInputEl,
        status: 'to-do'
    };
    // Pushing the tasklist into the new task then saving it to the local storage
    taskList.push(newTask);

    localStorage.setItem('tasks', JSON.stringify(taskList));
    // Appending the new task information that is created to the first column on the page "to-do"
    $('#todo-cards').append(createTaskCard(newTask));

    // Clear the form inputs
    $('#title-name-input').val('');
    $('#taskDueDate').val('');
    $('#message-text').val('');
    $('#addTaskBtn').click(function(){

    });
    // Modal to disapear/hide after pressing the "Add Task" button
    var modalElement = document.getElementById('exampleModal');
    var modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();

    renderTaskList();
}



// Function to handle the delete even when the "delete" button is pressed
function handleDeleteTask(event) {

    event.preventDefault();

    const taskId = $(this).attr('data-task-id');
  
    // Remove task from the array. 
    taskList.forEach((task) => {
      if (task.id == taskId) {
        taskList.splice(taskList.indexOf(task), 1);
      }
    });
  
    // Save the projects to localStorage
    localStorage.setItem('tasks', JSON.stringify(taskList));
  
    // Here we use our other function to print tasks back to the screen
    renderTaskList();
}

// Function to handle when the task cards are dropped at a certain status column
function handleDrop(event, ui) {


  // Get the task id from the event
  const taskId = ui.draggable[0].dataset.taskId;

  // Get the id of the lane that the card was dropped into
  const newStatus = event.target.id;

  for (let task of taskList) {
    // Find the task card by the `id` and update the task status.
    if (task.id == taskId) {
      task.status = newStatus;
    }
  }

  //  Save the updated tasks array to localStorage (overwritting the previous one) and render the new task data to the screen.
  localStorage.setItem('tasks', JSON.stringify(taskList));
  renderTaskList();
}

// When the page loads below functions and conditions will apply the tasks that were added before is displayed from local storage,
$(document).ready(function () {
    // The tasks that were added before is displayed from local storage
    renderTaskList();
    // Event listener for the the Modal form
    $('#taskForm').on('submit',handleAddTask);
    // Make the date picker in the Modal easier to use and give user the option to pick a date instead of typing the wrong format.
    $(function () {
        $("#taskDueDate").datepicker();
    });

    // Make lanes droppable
    $('.lane').droppable({
        accept: '.draggable',
        drop: handleDrop,
    });
});