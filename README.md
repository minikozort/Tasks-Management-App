# 05 Third-Party APIs: Task Board

## Your Task

Create a simple task board application that allows a team to manage project tasks by modifying starter code. This app will run in the browser and feature dynamically updated HTML and CSS powered by jQuery.

You'll need to use the [Day.js](https://day.js.org/en/) library to work with dates. Be sure to read the documentation carefully and concentrate on using Day.js in the browser.

## User Story

```md
AS A project team member with multiple tasks to organize
I WANT a task board 
SO THAT I can add individual project tasks, manage their state of progress and track overall project progress accordingly
```

## Acceptance Criteria

```md
GIVEN a task board to manage a project
WHEN I open the task board
THEN the list of project tasks is displayed in columns representing the task progress state (Not Yet Started, In Progress, Completed)
WHEN I view the task board for the project
THEN each task is color coded to indicate whether it is nearing the deadline (yellow) or is overdue (red)
WHEN I click on the button to define a new task
THEN I can enter the title, description and deadline date for the new task into a modal dialog
WHEN I click the save button for that task
THEN the properties for that task are saved in localStorage
WHEN I drag a task to a different progress column
THEN the task's progress state is updated accordingly and will stay in the new column after refreshing
WHEN I click the delete button for a task
THEN the task is removed from the task board and will not be added back after refreshing
WHEN I refresh the page
THEN the saved tasks persist
```

The following animation demonstrates the application functionality:

![A user adds three tasks to the task board and changes the state of two of them to in progress and then completion. The user then deletes the two cards in the done column.](./Assets/05-third-party-apis-homework-demo.gif)

## Grading Requirements

> **Note**: If a Challenge assignment submission is marked as “0”, it is considered incomplete and will not count towards your graduation requirements. Examples of incomplete submissions include the following:
>
> * A repository that has no code
>
> * A repository that includes a unique name but nothing else
>
> * A repository that includes only a README file but nothing else
>
> * A repository that only includes starter code

This Challenge is graded based on the following criteria:

### Technical Acceptance Criteria: 40%

* Satisfies all of the above acceptance criteria plus the following:

  * Uses the Day.js library to work with dates

### Deployment: 32%

* Application deployed at live URL

* Application loads with no errors

* Application GitHub URL submitted

* GitHub repo contains application code

### Application Quality: 15%

* Application user experience is intuitive and easy to navigate

* Application user interface style is clean and polished

* Application resembles the mock-up functionality provided in the Challenge instructions

### Repository Quality: 13%

* Repository has a unique name

* Repository follows best practices for file structure and naming conventions

* Repository follows best practices for class/id naming conventions, indentation, quality comments, etc.

* Repository contains multiple descriptive commit messages

* Repository contains quality README file with description, screenshot, and link to deployed application

## Review

You are required to submit the following for review:

* The URL of the deployed application

* The URL of the GitHub repository, with a unique name and a README describing the project

- - -
© 2024 edX Boot Camps LLC. Confidential and Proprietary. All Rights Reserved.
```// Retrieve tasks and nextId from localStorage
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
// Refractored this section to make it more readable and to fix some small issues
function handleAddTask(event) {
    event.preventDefault();
    // Read user input from the form
    const taskTitleInputEl = $('#title-name-input').val();
    const taskDueDateInputEl = $('#taskDueDate').val();
    const taskDescriptionInputEl = $('#message-text').val();
    const newTask = {
        id: generateTaskId(),
        title: taskTitleInputEl,
        description: taskDescriptionInputEl,
        dueDate: taskDueDateInputEl,
        status: 'to-do'
    };
    taskList.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(taskList));
    $('#to-do').append(createTaskCard(newTask));
    // Clear the form inputs
    $('#title-name-input').val('');
    $('#taskDueDate').val('');
    $('#message-text').val('');
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
New
2:24
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
});```
2:24
Alright thanks for waiting so I updated your code and it should fix the handleaddtask issue take a look at it and try it









