// Initialize task array from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// DOM Elements
const titleInput = document.getElementById("title");
const priorityInput = document.getElementById("priority");
const deadlineInput = document.getElementById("deadline");
const addTaskBtn = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const statusFilter = document.getElementById("statusFilter");
const priorityFilter = document.getElementById("priorityFilter");

// Add Task
addTaskBtn.addEventListener("click", () => {
  const title = titleInput.value.trim();
  const priority = priorityInput.value;
  const deadline = deadlineInput.value;

  if (!title || !deadline) return alert("Please fill all fields");

  const task = {
    id: Date.now(),
    title,
    priority,
    deadline,
    completed: false
  };

  tasks.push(task);
  saveAndRender();
  clearForm();
});

function clearForm() {
  titleInput.value = "";
  priorityInput.value = "Medium";
  deadlineInput.value = "";
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render Task List
function renderTasks() {
  const statusVal = statusFilter.value;
  const priorityVal = priorityFilter.value;

  taskList.innerHTML = "";

  const filtered = tasks.filter(task => {
    return (
      (statusVal === "All" || (statusVal === "Completed") === task.completed) &&
      (priorityVal === "All" || task.priority === priorityVal)
    );
  });

  filtered.forEach(task => {
    const div = document.createElement("div");
    div.className = "task";

    const info = document.createElement("div");
    info.className = "info";

    // Countdown / Overdue
    const deadlineDate = new Date(task.deadline);
    const today = new Date();
    const timeDiff = deadlineDate - today;
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    let statusText = "";

    if (task.completed) {
      statusText = `<span class="countdown">Completed</span>`;
    } else if (daysLeft < 0) {
      statusText = `<span class="overdue">Overdue</span>`;
    } else {
      statusText = `<span class="countdown">Due in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}</span>`;
    }

    info.innerHTML = `
      <h4>${task.title}</h4>
      <div class="meta">
        <span class="badge ${task.priority}">${task.priority}</span> &nbsp;
        <span>${task.deadline}</span> &nbsp;
        ${statusText}
      </div>
    `;

    const actions = document.createElement("div");
    actions.className = "actions";

    // Checkbox to toggle completed
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => toggleCompleted(task.id));

    // Edit button
    const editBtn = document.createElement("button");
    editBtn.innerHTML = `<i class="fas fa-edit"></i>`;
    editBtn.addEventListener("click", () => editTask(task.id));

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = `<i class="fas fa-trash"></i>`;
    deleteBtn.addEventListener("click", () => deleteTask(task.id));

    actions.appendChild(checkbox);
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    if (task.completed) {
      div.style.opacity = "0.6";
    }

    div.appendChild(info);
    div.appendChild(actions);
    taskList.appendChild(div);
  });
}

function toggleCompleted(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveAndRender();
}

function deleteTask(id) {
  if (confirm("Are you sure you want to delete this task?")) {
    tasks = tasks.filter(task => task.id !== id);
    saveAndRender();
  }
}

function editTask(id) {
  const task = tasks.find(t => t.id === id);
  const newTitle = prompt("Edit task title", task.title);
  const newDeadline = prompt("Edit deadline (yyyy-mm-dd)", task.deadline);

  if (newTitle && newDeadline) {
    task.title = newTitle;
    task.deadline = newDeadline;
    saveAndRender();
  }
}

// Filters
statusFilter.addEventListener("change", renderTasks);
priorityFilter.addEventListener("change", renderTasks);

function saveAndRender() {
  saveTasks();
  renderTasks();
}

renderTasks();
