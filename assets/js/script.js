var taskIdCounter = 0;
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var pageContentEl = document.querySelector("#page-content");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var tasks = [];

var taskFormHandler = function (event) {
  event.preventDefault();
  var taskNameInput = document.querySelector("input[name='task-name']").value;
  var taskTypeInput = document.querySelector("select[name='task-type']").value;
  //check if input values are empty strings
  if (!taskNameInput || !taskTypeInput) {
    alert("You need to fill out the task form!");
    return false;
  }
  document.querySelector("input[name='task-name']").value = "";
  document.querySelector("select[name='task-type']").selectedIndex = 0;
//   formEl.reset();

  var isEdit = formEl.hasAttribute("data-task-id");
  //package up data as an object

  // has data attribute, so get task id and call function to complete edit process
  if (isEdit) {
    var taskId = formEl.getAttribute("data-task-id");
    completeEditTask(taskNameInput, taskTypeInput, taskId); 
    } else {
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
          }; 
          createTaskEl(taskDataObj);
        }
      };

var createTaskEl = function (taskDataObj) {
        console.log(taskDataObj);
        console.log(taskDataObj.status);
        // create list item
        var listItemEl = document.createElement("li");
        listItemEl.className = "task-item";
      
        //add task id as a custom attribute
        listItemEl.setAttribute("data-task-id", taskIdCounter);
        listItemEl.setAttribute("draggable", "true");
      
        // create div to hold task into and add to list item
        var taskInfoEl = document.createElement("div");
        // give it a class name
        taskInfoEl.className = "task-info";
        // add HTML content to div
        taskInfoEl.innerHTML =
          "<h3 class='task-name'>" +
          taskDataObj.name +
          "</h3><span class='task-type'>" +
          taskDataObj.type +
          "</span>";
        listItemEl.appendChild(taskInfoEl);
      
       var taskActionsEl = createTaskActions(taskIdCounter);
        listItemEl.appendChild(taskActionsEl);
      
        switch (taskDataObj.status) {
          case "to do":
            taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 0;
            tasksToDoEl.append(listItemEl);
            break;
          case "in progress":
            taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 1;
            tasksInProgressEl.append(listItemEl);
            break;
          case "completed":
            taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 2;
            tasksCompletedEl.append(listItemEl);
            break;
          default:
            console.log("Something went wrong!");
        }
      
      //   // add entire list item to list
      //   tasksToDoEl.appendChild(listItemEl);
      
        taskDataObj.id = taskIdCounter;
      
        tasks.push(taskDataObj);
      
        saveTasks();
        //increase task counter for next unique id
        taskIdCounter++;
      };
      
      var createTaskActions = function (taskId) {
        var actionContainerEl = document.createElement("div");
        actionContainerEl.className = "task-actions";
      
        //create edit button
        var editButtonEl = document.createElement("button");
        editButtonEl.textContent = "Edit";
        editButtonEl.className = "btn edit-btn";
        editButtonEl.setAttribute("data-task-id", taskId);
        actionContainerEl.appendChild(editButtonEl);
      
        // create delete button
        var deleteButtonEl = document.createElement("button");
        deleteButtonEl.textContent = "Delete";
        deleteButtonEl.className = "btn delete-btn";
        deleteButtonEl.setAttribute("data-task-id", taskId);
        actionContainerEl.appendChild(deleteButtonEl);
      
        var statusSelectEl = document.createElement("select");
        statusSelectEl.className = "select-status";
        statusSelectEl.setAttribute("name", "status-change");
        statusSelectEl.setAttribute("data-task-id", taskId);
        actionContainerEl.appendChild(statusSelectEl);
      
        var statusChoices = ["To Do", "In Progress", "Completed"];
        for (var i = 0; i < statusChoices.length; i++) {
          //create option element
          var statusOptionEl = document.createElement("option");
          statusOptionEl.textContent = statusChoices[i];
          statusOptionEl.setAttribute("value", statusChoices[i]);
      
          //append to select
          statusSelectEl.appendChild(statusOptionEl);
        }
      
        return actionContainerEl;
      };

var completeEditTask = function(taskName, taskType, taskId) {
     //find the matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    //set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    //loop through tasks array and task object with new content
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
          tasks[i].name = taskName;
          tasks[i].type = taskType;
        }
      }
      saveTasks();
      alert("Task Updated!");

      formEl.removeAttribute("data-task-id");
      document.querySelector("#save-task").textContent = "Add Task";
    };
    // completeEditTask(taskNameInput, taskTypeInput, taskId);


//   no data attribute, so create object as normal and pass to createTaskEl function
//   else {
//     var taskDataObj = {
//       name: taskNameInput,
//       type: taskTypeInput,
//     };


var taskButtonHandler = function (event) {
    // get target element from event
    var targetEl = event.target;
  
    //edit button was clicked
    if (targetEl.matches(".edit-btn")) {
      var taskId = targetEl.getAttribute("data-task-id");
      editTask(taskId);
    }
    //delete button was clicked
    else if (targetEl.matches(".delete-btn")) {
      // git the element's task id
      var taskId = event.target.getAttribute("data-task-id");
      deleteTask(taskId);
    }
  };

  var taskStatusChangeHandler = function (event) {
    // get the task item's id
    var taskId = event.target.getAttribute("data-task-id");
  
    // get the currently selected option's value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();
  
    //find the parent task item element based on the id
    var taskSelected = document.querySelector(
      ".task-item[data-task-id='" + taskId + "']"
    );
  
    if (statusValue === "to do") {
      tasksToDoEl.appendChild(taskSelected);
    } else if (statusValue === "in progress") {
      tasksInProgressEl.appendChild(taskSelected);
    } else if (statusValue === "completed") {
      tasksCompletedEl.appendChild(taskSelected);
    }
    // update task's in tasks array
    for (var i = 0; i < tasks.length; i++) {
      if (tasks[i].id === parseInt(taskId)) {
        tasks[i].status = statusValue;
      }
      console.log(tasks);
    }
    saveTasks();
  };

  var editTask = function (taskId) {
    console.log(taskId);
    //get task list item element
    var taskSelected = document.querySelector(
      ".task-item[data-task-id='" + taskId + "']"
    );
    console.log(taskSelected);
    // get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    // console.log(taskName);
  
    var taskType = taskSelected.querySelector("span.task-type").textContent;
    // console.log(taskType);
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    formEl.querySelector("#save-task").textContent = "Save Task";
  
    formEl.setAttribute("data-task-id", taskId);
  };

formEl.addEventListener("submit", taskFormHandler);

var deleteTask = function (taskId) {
  var taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );
  taskSelected.remove();

  //create new array to hold updated list of tasks
  var updatedTaskArr = [];

  //loop through current tasks
  for (var i = 0; i < tasks.length; i++) {
    //if tasks[i].id doesn't match the value of taskId, let's keep that task and push it into the new
    if (tasks[i].id !== parseInt(taskId)) {
      updatedTaskArr.push(tasks[i]);
    }
  }
  //reassign tasks array to be the same as updatedTaskArr
  tasks = updatedTaskArr;
  saveTasks();
  alert("Task deleted!");
};

var dropTaskHandler = function(event) {
    event.preventDefault();
  var id = event.dataTransfer.getData("text/plain");
  var draggableElement = document.querySelector("[data-task-id='" + id + "']");
  var dropZone = event.target.closest(".task-list");
  var statusType = dropZone.id;
  // set status of task based on dropZone id
  var statusSelectEl = draggableElement.querySelector("select[name='status-change']");

  if (statusType === "tasks-to-do") {
    statusSelectEl.selectedIndex = 0;
  } else if (statusType === "tasks-in-progress") {
    statusSelectEl.selectedIndex = 1;
  } else if (statusType === "tasks-completed") {
    statusSelectEl.selectedIndex = 2;
  }

  // loop through tasks array to find and update the updated task's status
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(id)) {
      tasks[i].status = statusSelectEl.value.toLowerCase();
    }
  }
  saveTasks();

  dropZone.removeAttribute("style");
  dropZone.appendChild(draggableElement);
};

var dropZoneDragHandler = function(event) {
    var taskListEl = event.target.closest(".task-list");
    if (taskListEl) {
      event.preventDefault();
      taskListEl.setAttribute(
        "style",
        "background: rgba(68, 233, 255, .7); border-style: dashed;"
      );
    }
  };

var dragTaskHandler = function(event) {
  if (event.target.matches("li.task-item")) {
    var taskId = event.target.getAttribute("data-task-id");
    event.dataTransfer.setData("text/plain", taskId);
  
//   var getId = event.dataTransfer.getData("text/plain");
//   console.log("getId:", getId, typeof getId);
    }
};

var dragLeaveHandler = function(event) {
  var taskListEl = event.target.closest(".task-list");
  if (taskListEl) {
    event.target.closest(".task-list").removeAttribute("style");
  }
};

var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

var loadTasks = function () {
  var savedTasks = localStorage.getItem("tasks");
  if (!savedTasks) {
    return false;
  }
  savedTasks = JSON.parse(savedTasks);
  // loop through savedTasks array
  for (var i = 0; i < savedTasks.length; i++) {
      //pass each task object into the 'createTaskEl()' function
      createTaskEl(savedTasks[i]);
  }
  console.log("saved tasks");
};
//   for (var i = 0; i < tasks.length; i++) {
//     createTaskEl(savedTasks[i]);
//     task[i].id = taskIdCounter;
//     console.log(tasks[i]);
  
//     var listItemEl = document.createElement("li");
//   listItemEl.className = "task-item";
//   listItemEl.setAttribute("data-task-id", task[i].id);
//   listItemEl.setAttribute("draggable", "true");
//   console.log(listItemEl);
//   // get tasks from localStorage
//   //convert tasks from stringified format back into object array
//   //iterates through tasks array and creates task elements on page

//   var taskInfoEl = document.createElement("div");
//   taskInfoEl.className = "task-info";
//   taskInfoEl.innerHTML =
//     "<h3 class='task-name'>" +
//     task[i].name +
//     "</h3><span class='task-type'>" +
//     task[i].type +
//     "</span>";
   
//   taskInfoEl.appendChild("listItemEl");

//   var taskActionsEl = createTaskActions(task[i].id);
//   listItemEl.appendChild("taskActionsEl");

//     if (task[i].status === "to do") {
//         listItemEl.querySelector("select[name='staus-change']").selectedIndex = 0;
//         tasksToDoEl.appendChild("listItemEl");
//     } 
//     else if  (task[i].status === "in progress") {
//         listItemEl.querySelector("select[name='status-change']").selectedIndex = 1;
//         tasksInProgressEl.appendChild("listItemEl");
//     }
//     else if (task[i].status === "complete") {
//         listItemEl.querySelector("select[name='status-change']").selectedIndex = 2;
//         tasksCompletedEl.appendChild("listItemEl");
//     }
//     taskIdCounter++;
//     console.log(listItemEl);



// }
// };
formEl.addEventListener("submit", taskFormHandler)
pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);
pageContentEl.addEventListener("dragstart", dragTaskHandler);
pageContentEl.addEventListener("dragover", dropZoneDragHandler);
pageContentEl.addEventListener("drop", dropTaskHandler);
pageContentEl.addEventListener("dragleave", dragLeaveHandler);

loadTasks();
