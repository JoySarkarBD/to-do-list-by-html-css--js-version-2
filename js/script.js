// id selection function

function getElementById(id) {
  return document.getElementById(id);
}

const newTaskInput = getElementById("taskName");
const addTaskBtn = getElementById("addTask");
const taskList = getElementById("task_list");

// get task name from input field on enter keypress
newTaskInput.addEventListener("keypress", function (e) {
  if (e.key == "Enter" && !e.target.value) {
    alert("Add a task name");
    return;
  } else if (e.key == "Enter" && e.target.value) {
    addTask(e.target.value);
    newTaskInput.value = "";
  }
});

// get task name from input field
addTaskBtn.addEventListener("click", function (e) {
  // let taskName = newTaskInput.value;
  if (newTaskInput.value === "") {
    alert("Add a task name");
    return;
  }
  addTask(newTaskInput.value);
  newTaskInput.value = "";
});

function addTask(taskName) {
  const newTask = document.createElement("div");
  newTask.className = "item";

  const data = getDataFromLocalStorage();
  let uniqName = taskName;
  data.forEach((task) => {
    if (task[0].trim() === taskName.trim()) {
      uniqName += " ";
    }
  });

  newTask.innerHTML = `
    <li data-tag=${taskName}>${taskName}</li>
    <button class="edit"><i class="fas fa-pen"></i></button>
    <button class="completed"><i class="fas fa-check"></i></button>
    <button class="deleted"><i class="fas fa-trash-can"></i></button>`;

  const newTaskArray = [uniqName, "active"];
  taskList.appendChild(newTask);
  data.push(newTaskArray);
  setDataInLocalStorage(data);
}

// take orders from task's button

taskList.addEventListener("click", function (event) {
  if (event.target.className == "deleted") {
    deleteTask(event);
    // console.log("Task Deleted......");
  } else if (event.target.className == "completed") {
    completedTask(event);
    // console.log("Task Done......");
  } else if (event.target.className == "edit") {
    editTaskName(event);
    // console.log("Task Edited......");
  }
});

// task delete function
function deleteTask(event) {
  event.target.parentElement.remove();
  const task = event.target.parentElement.children[0].dataset.tag;
  deleteDataFromLocalStorage(task);
}

// task complete function

function completedTask(event) {
  const li = event.target.parentElement.children[0];
  const taskName = li.dataset.tag;
  li.classList.toggle("completed_task");
  const tasksData = getDataFromLocalStorage();

  let modifiedTask;
  let indexOf;
  tasksData.forEach((task, index) => {
    if (task[0] === taskName) {
      modifiedTask = tasksData[index];
      indexOf = index;
    }
  });
  if (modifiedTask[1] === "active") {
    modifiedTask[1] = "complete";
  } else {
    modifiedTask[1] = "active";
  }

  tasksData.splice(indexOf, 1, modifiedTask);
  setDataInLocalStorage(tasksData);
}

// task edit function
function editTaskName(event) {
  const li = event.target.parentElement.children[0];
  const taskName = li.dataset.tag;
  const previousName = taskName;
  li.innerHTML = "";
  const input = document.createElement("input");
  input.type = "text";
  input.value = previousName;

  input.addEventListener("keypress", function (e) {
    if (e.key == "Enter") {
      const newTaskName = e.target.value;
      li.innerHTML = newTaskName;
      li.dataset.tag = newTaskName;
      event.target.style.display = "inline";

      const tasksData = getDataFromLocalStorage();

      let modifiedTaskName;
      let indexOf;
      tasksData.forEach((task, index) => {
        if (task[0] === previousName) {
          modifiedTaskName = tasksData[index];
          indexOf = index;
        }
      });
      modifiedTaskName[0] = newTaskName;
      tasksData.splice(indexOf, 1, modifiedTaskName);
      setDataInLocalStorage(tasksData);
    }
  });

  li.appendChild(input);
  event.target.style.display = "none";
}

// load data from LocalStorage
document.body.onload = function (e) {
  const data = getDataFromLocalStorage();
  displayData(data);
};

// get data from localStorage

function getDataFromLocalStorage() {
  let task;
  const data = localStorage.getItem("tasks");
  if (data) {
    task = JSON.parse(data);
  } else {
    task = [];
  }
  return task;
}

// show data in ui

function displayData(data) {
  data.forEach((task) => {
    const item = document.createElement("div");
    let classOfListItem;
    item.className = "item";
    if (task[1] === "complete") {
      classOfListItem = "completed_task";
    } else {
      classOfListItem = "";
    }
    item.innerHTML = `
    <li data-tag=${task[0]} class=${classOfListItem}>${task[0]}</li>
    <button class="edit"><i class="fas fa-pen"></i></button>
    <button class="completed"><i class="fas fa-check"></i></button>
    <button class="deleted"><i class="fas fa-trash-can"></i></button>
   `;
    taskList.appendChild(item);
  });
}

function setDataInLocalStorage(data) {
  localStorage.setItem("tasks", JSON.stringify(data));
}

// delete data from local storage

function deleteDataFromLocalStorage(data) {
  const tasksData = getDataFromLocalStorage();
  let indexOfData;
  tasksData.forEach((task, index) => {
    if (task[0] === data) {
      indexOfData = index;
    }
  });

  tasksData.splice(indexOfData, 1);
  setDataInLocalStorage(tasksData);
}

// data from localStorage
// [["item-1","active"],["item-1","active"],["item-1","active"],["item-1","active"],["item-1","active"]]
