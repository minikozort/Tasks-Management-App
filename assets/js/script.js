// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));
const taskTitle = $('#title-name-input');
const taskDueDate = $('#taskDueDate');
const taskDescription = $('#message-text');


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

    // ? Retrieve projects from localStorage and parse the JSON to an array.
    // ? We use `let` here because there is a chance that there are no tasks in localStorage (which means the tasks variable will be equal to `null`) and we will need it to be initialized to an empty array.
    let tasks = JSON.parse(localStorage.getItem('nextId'));

    // ? If no tasks were retrieved from localStorage, assign projects to a new empty array to push to later.
    if (!tasks) {
        tasks = [];
    }

    // ? Return the tasks array either empty or with data in it whichever it was determined to be by the logic right above.
    return tasks;

}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {

    event.preventDefault();

    console.log(renderTaskList());

    localStorage.setItem('tasks', JSON.stringify(taskList));

    renderTaskList()
}


//  Read user input from the form
    taskTitle = taskTitleInputEl.val().trim();
    taskDescription = taskDescriptionInputEl.val(); // don't need to trim select input
    taskDueDate = taskDueDateInputEl.val(); // yyyy-mm-dd format

const task = {
    // ? Here we use a Web API called `crypto` to generate a random id for our project. This is a unique identifier that we can use to find the project in the array. `crypto` is a built-in module that we can use in the browser and Nodejs.    id: crypto.randomUUID(),
    title: taskTitle,
    description: taskDescription,
    dueDate: taskDueDate,
    status: 'to-do',
    id: generateTaskId()
}

    // // // ? Print project data back to the screen
    renderTaskList()

    // // ? Clear the form inputs
    taskTitleInputEl.val('');
    taskDescriptionInputEl.val('');
    taskDueDateInputEl.val('');





    const tasks = renderTaskList();

    // ? Empty existing project cards out of the lanes
    const todoList = $('#todo-cards');
    todoList.empty();

    const inProgressList = $('#in-progress-cards');
    inProgressList.empty();

    const doneList = $('#done-cards');
    doneList.empty();

    // ? Loop through projects and create project cards for each status
    for (let task of tasks) {
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
      helper: function (e) {
        // ? Check if the target of the drag event is the card itself or a child element. If it is the card itself, clone it, otherwise find the parent card  that is draggable and clone that.
        const original = $(e.target).hasClass('ui-draggable')
          ? $(e.target)
          : $(e.target).closest('.ui-draggable');
        // ? Return the clone with the width set to the width of the original card. This is so the clone does not take up the entire width of the lane. This is to also fix a visual bug where the card shrinks as it's dragged to the right.
        return original.clone().css({
          width: original.outerWidth(),
        });
      },
    });
  

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    


}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

    $(function () {
        $("#taskDueDate").datepicker();
    });


    $('#taskForm').on('submit', createTaskCard);
});



