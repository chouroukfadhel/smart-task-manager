let tasks = JSON.parse(localStorage.getItem("smartTasks")) || [];

const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priorityInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const searchInput = document.getElementById("searchInput");
const filterInput = document.getElementById("filterInput");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const clearCompleted = document.getElementById("clearCompleted");

function saveTasks() {
    localStorage.setItem("smartTasks", JSON.stringify(tasks));
}

function renderTasks() {
    const searchTerm = searchInput.value.toLowerCase();
    const filter = filterInput.value;

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title
            .toLowerCase()
            .includes(searchTerm);

        const matchesFilter =
            filter === "all" ||
            (filter === "active" && !task.completed) ||
            (filter === "completed" && task.completed);

        return matchesSearch && matchesFilter;
    });

    taskList.innerHTML = "";

    if (filteredTasks.length === 0) {
        taskList.innerHTML =
            '<li class="empty">No tasks found.</li>';
    }

    filteredTasks.forEach(task => {
        const li = document.createElement("li");

        li.className = `task ${task.completed ? "completed" : ""}`;

        li.innerHTML = `
            <div class="task-info">
                <div class="task-title">${escapeHTML(task.title)}</div>
                <span class="priority priority-${task.priority}">
                    ${task.priority.toUpperCase()} PRIORITY
                </span>
            </div>

            <div class="task-actions">
                <button class="complete-btn"
                    onclick="toggleTask('${task.id}')">
                    ${task.completed ? "Undo" : "Complete"}
                </button>

                <button class="delete-btn"
                    onclick="deleteTask('${task.id}')">
                    Delete
                </button>
            </div>
        `;

        taskList.appendChild(li);
    });

    const activeTasks = tasks.filter(task => !task.completed).length;

    taskCount.textContent =
        `${activeTasks} ${activeTasks === 1 ? "task" : "tasks"} remaining`;
}

function addTask() {
    const title = taskInput.value.trim();

    if (!title) {
        alert("Please enter a task.");
        return;
    }

    const task = {
        id: Date.now().toString(),
        title: title,
        priority: priorityInput.value,
        completed: false
    };

    tasks.push(task);

    saveTasks();
    renderTasks();

    taskInput.value = "";
    priorityInput.value = "medium";
    taskInput.focus();
}

function toggleTask(id) {
    tasks = tasks.map(task =>
        task.id === id
            ? { ...task, completed: !task.completed }
            : task
    );

    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    renderTasks();
}

function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        addTask();
    }
});

searchInput.addEventListener("input", renderTasks);

filterInput.addEventListener("change", renderTasks);

clearCompleted.addEventListener("click", () => {
    tasks = tasks.filter(task => !task.completed);

    saveTasks();
    renderTasks();
});

renderTasks();