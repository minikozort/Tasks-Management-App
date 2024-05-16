// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
taskList = Array.isArray(taskList) ? taskList : [];
// I added this function to ensure that taskList is always in an array so you can use .push
let nextId = JSON.parse(localStorage.getItem("nextId"));


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

        // ? If the task is due today, make the card yellow. If it is overdue, make it red.
        if (now.isSame(cardDueDate, 'day')) {
            taskCard.addClass('bg-warning text-white');
        } else if (now.isAfter(cardDueDate)) {
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
function renderTaskList() {

    if (!taskList) {
        taskList = []
    }

    // ? Empty existing project cards out of the lanes
    const todoList = $('#todo-cards');
    todoList.empty();
  
    const inProgressList = $('#in-progress-cards');
    inProgressList.empty();
  
    const doneList = $('#done-cards');
    doneList.empty();
  
    // ? Loop through projects and create project cards for each status
    for (let task of taskList) {
      if (task.status === 'to-do') {
        todoList.append(createTaskCard(task));
      } else if (task.status === 'in-progress') {
        inProgressList.append(createTaskCard(task));
      } else if (task.status === 'done') {
        doneList.append(createTaskCard(task));
      }
    }

    // ? Use JQuery UI to make task cards draggable
    $('.draggable').draggable({
        opacity: 0.7,
        zIndex: 100,
        // ? This is the function that creates the clone of the card that is dragged. This is purely visual and does not affect the data.
        // helper: function (e) {
        //     // ? Check if the target of the drag event is the card itself or a child element. If it is the card itself, clone it, otherwise find the parent card  that is draggable and clone that.
        //     const original = $(e.target).hasClass('ui-draggable')
        //     ? $(e.target)
        //     : $(e.target).closest('.ui-draggable');
        //     // ? Return the clone with the width set to the width of the original card. This is so the clone does not take up the entire width of the lane. This is to also fix a visual bug where the card shrinks as it's dragged to the right.
        //     return original.clone().css({
        //     width: original.outerWidth(),
        //     });
        // },
        });

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
        dueDate: taskDueDateInputEl,
        description: taskDescriptionInputEl,
        status: 'to-do'
    };

    taskList.push(newTask);

    localStorage.setItem('tasks', JSON.stringify(taskList));

    $('#todo-cards').append(createTaskCard(newTask));

    // Clear the form inputs
    $('#title-name-input').val('');
    $('#taskDueDate').val('');
    $('#message-text').val('');
    $('#addTaskBtn').click(function(){

    });
    var modalElement = document.getElementById('exampleModal');
    var modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();


}



// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {

    event.preventDefault();

    const taskId = $(this).attr('data-task-id');
    const tasks = JSON.parse(localStorage.getItem("tasks"));
  
    // ? Remove project from the array. There is a method called `filter()` for this that is better suited which we will go over in a later activity. For now, we will use a `forEach()` loop to remove the project.
    tasks.forEach((task) => {
      if (task.id === taskId) {
        tasks.splice(tasks.indexOf(task), 1);
      }
    });
  
    // ? We will use our helper function to save the projects to localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));
  
    // ? Here we use our other function to print projects back to the screen
    renderTaskList();

    $(this).closest('.card').remove();

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  // ? Read projects from localStorage
  //const tasks = localStorage.getItem(JSON.parse('tasks'));

  // ? Get the project id from the event
  const taskId = ui.draggable[0].dataset.taskId;

  // ? Get the id of the lane that the card was dropped into
  const newStatus = event.target.id;

  for (let task of taskList) {
    // ? Find the project card by the `id` and update the project status.
    if (task.id == taskId) {
      task.status = newStatus;

      console.log('test');
    }
   
  }

  // ? Save the updated projects array to localStorage (overwritting the previous one) and render the new project data to the screen.
  localStorage.setItem('tasks', JSON.stringify(taskList));
  renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {



    renderTaskList();



    $('#taskForm').on('submit',handleAddTask);


    $(function () {
        $("#taskDueDate").datepicker();
    });

    // ? Make lanes droppable
    $('.lane').droppable({
        accept: '.draggable',
        drop: handleDrop,
    });

});



