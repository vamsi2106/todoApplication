let todoItemsContainer = document.getElementById("todoItemsContainer");
let addTodoButton = document.getElementById("addTodoButton");
let saveTodoButton = document.getElementById("saveTodoButton");
let reminderTimeInput = document.getElementById("reminderTime");
let reminderAudio = document.getElementById("reminderAudio");
let stopAudioButton = document.getElementById("stopAudioButton");

let isReminderSet = false;

function onSetReminder() {
  let reminderTime = reminderTimeInput.value;
  if (reminderTime === "") {
    alert("Enter Valid Reminder Time");
    return;
  }

  isReminderSet = true;
  reminderTimeInput.disabled = true;
  addTodoButton.disabled = true;
  saveTodoButton.disabled = true;
  checkReminderTime();
}

reminderTimeInput.addEventListener("change", function () {
  if (isReminderSet) {
    isReminderSet = false;
    reminderTimeInput.disabled = false;
    addTodoButton.disabled = false;
    saveTodoButton.disabled = false;
    stopAudioButton.style.display = "none";
  }
});

function getTodoListFromLocalStorage() {
  let stringifiedTodoList = localStorage.getItem("todoList");
  let parsedTodoList = JSON.parse(stringifiedTodoList);
  if (parsedTodoList === null) {
    return [];
  } else {
    return parsedTodoList;
  }
}

let todoList = getTodoListFromLocalStorage();
let todosCount = todoList.length;

function checkReminderTime() {
  setInterval(function () {
    let currentTime = new Date();
    for (let todo of todoList) {
      let [hour, minute] = todo.reminderTime.split(":");
      let reminderTime = new Date(currentTime);
      reminderTime.setHours(parseInt(hour), parseInt(minute), 0, 0);

      if (
        !todo.isChecked &&
        currentTime >= reminderTime &&
        currentTime <= reminderTime.getTime() + 3000
      ) {
        playReminderAudio();
        alert(`Task: ${todo.text}\nReminder: Complete Task`);
        stopReminderAudio();
      }
    }
  }, 1000);
}
checkReminderTime();

function playReminderAudio() {
  reminderAudio.muted = false;
  reminderAudio.play();
}

function stopReminderAudio() {
  reminderAudio.pause();
  reminderAudio.currentTime = 0;
  reminderAudio.muted = true;
  isReminderSet = false;
  reminderTimeInput.disabled = false;
  addTodoButton.disabled = false;
  saveTodoButton.disabled = false;
  stopAudioButton.style.display = "none";
}

stopAudioButton.onclick = function () {
  stopReminderAudio();
};

// ... existing code ...

saveTodoButton.onclick = function () {
  localStorage.setItem("todoList", JSON.stringify(todoList));
};

function onAddTodo() {
  let userInputElement = document.getElementById("todoUserInput");
  let userInputValue = userInputElement.value;
  let reminderTime = reminderTimeInput.value; // Get reminder time

  if (userInputValue === "") {
    alert("Enter Valid Text");
    return;
  }

  todosCount = todosCount + 1;

  let newTodo = {
    text: userInputValue,
    uniqueNo: todosCount,
    isChecked: false,
    reminderTime: reminderTime, // Store reminder time in todo object
  };
  todoList.push(newTodo);
  createAndAppendTodo(newTodo);
  userInputElement.value = "";
  reminderTimeInput.value = ""; // Clear reminder time input after adding todo
}

addTodoButton.onclick = function () {
  onAddTodo();
};

function onTodoStatusChange(checkboxId, labelId, todoId) {
  let checkboxElement = document.getElementById(checkboxId);
  let labelElement = document.getElementById(labelId);
  labelElement.classList.toggle("checked");

  let todoObjectIndex = todoList.findIndex(function (eachTodo) {
    let eachTodoId = "todo" + eachTodo.uniqueNo;

    if (eachTodoId === todoId) {
      return true;
    } else {
      return false;
    }
  });

  let todoObject = todoList[todoObjectIndex];

  if (todoObject.isChecked === true) {
    todoObject.isChecked = false;
  } else {
    todoObject.isChecked = true;
  }
}

function onDeleteTodo(todoId) {
  let todoElement = document.getElementById(todoId);
  todoItemsContainer.removeChild(todoElement);

  let deleteElementIndex = todoList.findIndex(function (eachTodo) {
    let eachTodoId = "todo" + eachTodo.uniqueNo;
    if (eachTodoId === todoId) {
      return true;
    } else {
      return false;
    }
  });

  todoList.splice(deleteElementIndex, 1);
}

function createAndAppendTodo(todo) {
  let todoId = "todo" + todo.uniqueNo;
  let checkboxId = "checkbox" + todo.uniqueNo;
  let labelId = "label" + todo.uniqueNo;

  let todoElement = document.createElement("li");
  todoElement.classList.add("todo-item-container", "d-flex", "flex-row");
  todoElement.id = todoId;
  todoItemsContainer.appendChild(todoElement);

  let inputElement = document.createElement("input");
  inputElement.type = "checkbox";
  inputElement.id = checkboxId;
  inputElement.checked = todo.isChecked;

  inputElement.onclick = function () {
    onTodoStatusChange(checkboxId, labelId, todoId);
  };

  inputElement.classList.add("checkbox-input");
  todoElement.appendChild(inputElement);

  let labelContainer = document.createElement("div");
  labelContainer.classList.add("label-container", "d-flex", "flex-row");
  todoElement.appendChild(labelContainer);

  let labelElement = document.createElement("label");
  labelElement.setAttribute("for", checkboxId);
  labelElement.id = labelId;
  labelElement.classList.add("checkbox-label");
  labelElement.textContent = todo.text;
  if (todo.isChecked === true) {
    labelElement.classList.add("checked");
  }
  labelContainer.appendChild(labelElement);
  //addd
  let reminderLabel = document.createElement("div");
  reminderLabel.classList.add("label-reminder");
  reminderLabel.textContent = "Reminder: " + todo.reminderTime;
  labelContainer.appendChild(reminderLabel);
  ///addddddddd
  let deleteIconContainer = document.createElement("div");
  deleteIconContainer.classList.add("delete-icon-container");
  labelContainer.appendChild(deleteIconContainer);

  let deleteIcon = document.createElement("i");
  deleteIcon.classList.add("far", "fa-trash-alt", "delete-icon");

  deleteIcon.onclick = function () {
    onDeleteTodo(todoId);
  };

  deleteIconContainer.appendChild(deleteIcon);
}

for (let todo of todoList) {
  createAndAppendTodo(todo);
}
