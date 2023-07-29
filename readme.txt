1. **Task Management**

   The task management part of the code handles adding new tasks to the list and storing them in the `todoList` array. When the "Add" button is clicked, the `onAddTodo` function is called. It gets the user input for the task description and reminder time, validates the input, and creates a new todo object with the task details. The todo object is then added to the `todoList` array using the `push` method. The `createAndAppendTodo` function is called to display the newly added task on the web page.

   ```javascript
   function onAddTodo() {
     // Get user input values for task description and reminder time
     let userInputElement = document.getElementById("todoUserInput");
     let userInputValue = userInputElement.value;
     let reminderTime = reminderTimeInput.value; // Get reminder time

     // Validate task description input
     if (userInputValue === "") {
       alert("Enter Valid Text");
       return;
     }

     // Increment todosCount to create unique IDs for tasks
     todosCount = todosCount + 1;

     // Create a new todo object with task details
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
   ```

2. **Set Reminder Feature**

   The set reminder feature allows users to set a reminder for a task with an audio alert. When the "Set Reminder" button is clicked, the `onSetReminder` function is called. It gets the reminder time from the user input, validates it, and sets the `isReminderSet` flag to true. This flag is used to disable the input and buttons to prevent changes while the reminder is active. The `checkReminderTime` function is then called to continuously check if the reminder time matches the current time and trigger the reminder audio and alert notification.

   ```javascript
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

   function playReminderAudio() {
     reminderAudio.play();
   }

   function stopReminderAudio() {
     reminderAudio.pause();
     reminderAudio.currentTime = 0;
     isReminderSet = false;
     reminderTimeInput.disabled = false;
     addTodoButton.disabled = false;
     saveTodoButton.disabled = false;
     stopAudioButton.style.display = "none";
   }
   ```

3. **Event Listeners**

   Event listeners are used to respond to user interactions and trigger specific functions accordingly. The event listeners in this code are as follows:

   - The `reminderTimeInput` element has a `change` event listener that resets the reminder settings when the reminder time input changes. If a reminder is set and the input is changed, the `isReminderSet` flag is reset, and the input and buttons are re-enabled.

   - The `addTodoButton` element has a `click` event listener that calls the `onAddTodo` function when clicked. This adds a new task to the list.

   - The `stopAudioButton` element has a `click` event listener that calls the `stopReminderAudio` function when clicked. This stops the reminder audio and resets the reminder settings.

   ```javascript
   reminderTimeInput.addEventListener("change", function () {
     if (isReminderSet) {
       isReminderSet = false;
       reminderTimeInput.disabled = false;
       addTodoButton.disabled = false;
       saveTodoButton.disabled = false;
       stopAudioButton.style.display = "none";
     }
   });

   addTodoButton.onclick = function () {
     onAddTodo();
   };

   stopAudioButton.onclick = function () {
     stopReminderAudio();
   };
   ```

These are the main components of the Todo Application code. They handle the task management, set reminder feature, and user interactions using event listeners. The application allows users to manage their tasks effectively with the added functionality of reminders and audio alerts.
