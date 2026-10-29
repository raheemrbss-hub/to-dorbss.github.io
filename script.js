const taskInput = document.querySelector("#new-task-input");
const addTask = document.querySelector("#add-button");
const allBtn = document.querySelector("#all-button");
const completedBtn = document.querySelector("#completed-button");
const activeBtn = document.querySelector("#active-button");
const content = document.querySelector(".content-div");
const totalCount = document.querySelector("#totalCount");
const completeCount = document.querySelector("#completedCount");
const dltAllBtn = document.querySelector("#dlt-all");

let todos = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function save() {
    localStorage.setItem("tasks", JSON.stringify(todos));
    printList();
}

// 1. Create a single helper function to handle adding the task
function handleAddTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        content.innerHTML = "<h2>Please enter a task</h2>";
        return;
    }

    const newtask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    todos.push(newtask);
    taskInput.value = "";
    save();
}

// 2. Trigger it when clicking the "Add Task" button
addTask.addEventListener("click", handleAddTask);

// 3. Trigger it when pressing "Enter" inside the text INPUT box
taskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        handleAddTask();
    }
});

function printList() {
    content.replaceChildren();

    // Dynamically calculate tracking panel stats
    totalCount.textContent = todos.length;
    completeCount.textContent = todos.filter(t => t.completed).length;

    // Isolate active dataset to match user view filters
    const filteredTask = todos.filter(item => {
        if (currentFilter === "active") return !item.completed;
        if (currentFilter === "completed") return item.completed;
        return true;
    });

    filteredTask.forEach((todo) => {
        const li = document.createElement("li");
        li.classList.add("list");

        // Native Checklist Control Element
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.completed;
        checkbox.classList.add("complete-checkbox");

        checkbox.addEventListener("change", () => {
            todo.completed = checkbox.checked;
            save();
        });

        // Content Display Wrapper Row Box
        const textContainer = document.createElement("div");
        textContainer.style.flex = "1";

        const span = document.createElement("span");
        span.textContent = todo.text;

        if (todo.completed) {
            span.style.textDecoration = "line-through";
            span.style.color = "#94a3b8";
        }

        textContainer.append(span);

        const status = document.createElement("span");
        status.textContent = todo.completed ? "Complete" : "Active";
        status.classList.add("status");

        // Action Modification Controller Elements
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.classList.add("edit-btn");

        editBtn.addEventListener("click", () => {
            const isEditing = li.classList.contains("editing");

            if (!isEditing) {
                li.classList.add("editing");
                editBtn.textContent = "Save";

                const editInput = document.createElement("input");
                editInput.type = "text";
                editInput.value = todo.text;
                editInput.classList.add("edit-input");

                editInput.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") editBtn.click();
                });

                textContainer.replaceChild(editInput, span);
                editInput.focus();
            } else {
                const editInput = textContainer.querySelector(".edit-input");
                const updatedText = editInput.value.trim();

                if (updatedText !== "") {
                    todo.text = updatedText;
                    save();
                } else {
                    printList();
                }
            }
        });

        const dltBtn = document.createElement("button");
        dltBtn.textContent = "Delete";
        dltBtn.classList.add("del");

        dltBtn.addEventListener("click", () => {
            // Show a confirmation alert box
            const confirmDelete = confirm(`Are you sure you want to delete "${todo.text}"?`);

            // Only delete the task if the user clicks "OK"
            if (confirmDelete) {
                todos = todos.filter(item => item.id !== todo.id);
                save();
            }
        });

        li.append(checkbox, textContainer, status, editBtn, dltBtn);
        content.append(li);
    });
}

function setFilters(filter, button) {
    currentFilter = filter;
    allBtn.classList.remove("active");
    completedBtn.classList.remove("active");
    activeBtn.classList.remove("active");
    button.classList.add("active");
    printList();
}

// Global UI Node Tab Observers
allBtn.addEventListener("click", () => setFilters("all", allBtn));
completedBtn.addEventListener("click", () => setFilters("completed", completedBtn));
activeBtn.addEventListener("click", () => setFilters("active", activeBtn));
dltAllBtn.addEventListener("click", (e) => {
    localStorage.clear()
    printList();
});
// Mount payload state parameters on initial initialization context
printList();
