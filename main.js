const taskContainer = document.querySelector("#task-container");
const deleteToast = document.querySelector("#delete-toast");
const taskFilter = document.querySelector("#task-filter");

// States
// Get tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let taskStatus = "all";
updateTaskContainer();

// Add Task
const addBtn = document.querySelector("#addBtn");
addBtn.addEventListener("click", addTask);

function addTask() {
  const taskInput = document.querySelector("#task");

  // Update state
  tasks.push({
    id: tasks.length,
    title: taskInput.value,
    done: false,
  });

  // Update UI
  // Update task input
  taskInput.value = "";
  taskInput.focus();

  // Update task container
  updateTaskContainer();
}

// Filter tasks
taskFilter.addEventListener("change", changeStatus);
function changeStatus(e) {
  taskStatus = e.target.value;
  updateTaskContainer();
}

function filterTasks(tasks, status) {
  if (status === "all") {
    return tasks;
  } else if (status === "done") {
    return tasks.filter((task) => task.done);
  } else if (status === "not-finished") {
    return tasks.filter((task) => !task.done);
  }
}

// Update UI
function updateTaskContainer() {
  // Store tasks in localStorage
  localStorage.setItem("tasks", JSON.stringify(tasks));

  // Generate task container markup
  const result = filterTasks(tasks, taskStatus).reduce((acc, task) => {
    return acc + generateTaskMarkup(task);
  }, "");
  taskContainer.innerHTML = result;

  // Add events for action buttons
  handleActionButton();
}

// Generate task container markup
function generateTaskMarkup(task) {
  return `         
  <li class="list-group-item d-flex align-items-center gap-3 task">
  <input
    class="form-check-input me-1 task-status"
    type="checkbox"
    id="firstCheckbox"
    ${task.done && "checked"}
  />
  <label class="form-check-label flex-grow-1 task-label" for="firstCheckbox" 
   >${task.title}</label
  >
  <input type="text" class="form-control task-input" value=${task.title}>

  <div class="flex-shrink-0 d-flex gap-1">
    <button class="btn btn-success save-btn">
      <svg
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M4.5 12.75l6 6 9-13.5"
        ></path>
      </svg>
    </button>

    <button class="btn btn-success edit-btn">
      <svg
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
        ></path>
      </svg>
    </button>
    <button class="btn btn-danger delete-btn">
      <svg
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
        ></path>
      </svg>
    </button>
  </div>
</li>
`;
}

// Handle buttons in task
function handleActionButton() {
  const editBtnList = document.querySelectorAll(".edit-btn");
  const saveBtnList = document.querySelectorAll(".save-btn");
  const deleteBtnList = document.querySelectorAll(".delete-btn");
  const taskStatusList = document.querySelectorAll(".task-status");
  tasks.forEach((task, index) => {
    // Edit button
    editBtnList[index].addEventListener("click", editTaskInput);
    function editTaskInput(e) {
      // Add edditing class to task
      const taskEl = e.target.closest(".task");
      const taskInput = taskEl.querySelector(".task-input");
      taskEl.classList.add("editting");

      // Focus to input
      taskInput.focus();
      taskInput.value = "";
      taskInput.value = task.title;
    }

    // Change task title
    saveBtnList[index].addEventListener("click", (e) => changeTask(e, task.id));
    function changeTask(e, id) {
      const taskEl = e.target.closest(".task");
      const taskInput = taskEl.querySelector(".task-input");

      tasks = tasks.map((task) =>
        task.id === id ? { ...task, title: taskInput.value } : task
      );

      updateTaskContainer();
    }

    // Change task status
    taskStatusList[index].addEventListener("change", (e) =>
      updateStatus(e, task.id)
    );
    function updateStatus(e, id) {
      tasks = tasks.map((task) =>
        task.id === id ? { ...task, done: e.target.checked } : task
      );

      updateTaskContainer();
    }

    // Delete task
    deleteBtnList[index].addEventListener("click", () => deleteTask(task.id));
    function deleteTask(id) {
      const toast = new bootstrap.Toast(deleteToast);
      toast.show();

      // Update state
      tasks = tasks.filter((task) => task.id !== id);

      // Update UI
      updateTaskContainer();
    }
  });
}
